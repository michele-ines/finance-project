import { NextResponse } from 'next/server';
import { mkdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import connectMongoDB from 'libs/mongoDB';
import Transacao from 'models/transacao';
import { handleRequest } from 'utils/error-handlers/error-handle';

export const runtime = 'nodejs';

/* -------------------------------------------------------- */
/*  Tipagens auxiliares                                     */
/* -------------------------------------------------------- */
type Params = Promise<{ id: string }>;

interface AttachmentDTO {
  name: string;
  url:  string;
}

interface UpdateTransacao {
  tipo?:      string;
  valor?:     string;
  categoria?: string | null;
  $push?: {
    anexos: { $each: AttachmentDTO[] };
  };
}

/* -------------------------------------------------------- */
/*  Utilitário para salvar arquivos                         */
/* -------------------------------------------------------- */
async function saveFile(file: File): Promise<AttachmentDTO> {
  const buffer     = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    await stat(uploadsDir);
  } catch {
    await mkdir(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);

  await writeFile(filePath, buffer);

  return { name: file.name, url: `/uploads/${safeName}` };
}

/* -------------------------------------------------------- */
/*  Helpers                                                 */
/* -------------------------------------------------------- */
const getString = (fd: FormData, key: string): string | null => {
  const v = fd.get(key);
  return typeof v === 'string' && v.trim() !== '' ? v : null;
};

/* ------------------------------------------------------------------ */
/*  GET                                                               */
/* ------------------------------------------------------------------ */
export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params;

  return handleRequest(async () => {
    await connectMongoDB();

    const transacao = await Transacao.findById(id);
    if (!transacao) {
      return NextResponse.json(
        { message: 'Transação não encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json({ transacao }, { status: 200 });
  });
}

/* ------------------------------------------------------------------ */
/*  PUT – edita campos + acrescenta novos anexos                      */
/* ------------------------------------------------------------------ */
export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = await params;

  return handleRequest(async () => {
    const contentType = req.headers.get('content-type') ?? '';
    const update: UpdateTransacao = {};

    /* ---------- JSON puro --------------------------------------- */
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as Partial<UpdateTransacao>;
      Object.assign(update, body);
    }

    /* ---------- multipart/form-data ----------------------------- */
    else {
      const fd = await req.formData();

      const tipo      = getString(fd, 'tipo');
      const valor     = getString(fd, 'valor');
      const categoria = getString(fd, 'categoria');

      if (tipo)      update.tipo      = tipo;
      if (valor)     update.valor     = valor;
      if (categoria) update.categoria = categoria;

      /* ---- novos anexos --------------------------------------- */
      const novos: AttachmentDTO[] = [];
      const files = fd.getAll('anexos') as File[];

      for (const f of files) {
        if (f && f.size > 0) novos.push(await saveFile(f));
      }

      if (novos.length) {
        update.$push = { anexos: { $each: novos } };
      }
    }

    await connectMongoDB();
    const atualizada = await Transacao.findByIdAndUpdate(id, update, {
      new: true,
    });

    return NextResponse.json(
      { message: 'Transação atualizada com sucesso', transacao: atualizada },
      { status: 200 },
    );
  });
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                            */
/* ------------------------------------------------------------------ */
export async function DELETE(_req: Request, { params }: { params: Params }) {
  const { id } = await params;

  return handleRequest(async () => {
    await connectMongoDB();
    await Transacao.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Transação excluída com sucesso' },
      { status: 200 },
    );
  });
}
