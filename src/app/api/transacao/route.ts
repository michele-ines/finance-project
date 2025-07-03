import { NextResponse } from "next/server";
import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";
import connectMongoDB from "libs/mongoDB";
import Transacao from "models/transacao";
import { handleRequest } from "utils/error-handlers/error-handle";

export const runtime = "nodejs"; // permite fs no RSC

/* ------------------------------------------------------------------ */
/*  GET – paginação                                                   */
/* ------------------------------------------------------------------ */
export async function GET(request: Request) {
  return handleRequest(async () => {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    await connectMongoDB();

    const [transacoes, total] = await Promise.all([
      Transacao.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transacao.countDocuments(),
    ]);

    return NextResponse.json({ transacoes, total }, { status: 200 });
  });
}

/* ------------------------------------------------------------------ */
/*  POST – cria nova transação + anexos                               */
/* ------------------------------------------------------------------ */
async function saveFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    await stat(uploadsDir);
  } catch {
    await mkdir(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadsDir, safeName);
  await writeFile(filePath, buffer);

  return { name: file.name, url: `/uploads/${safeName}` };
}

/* util para validar entradas obrigatórias em FormData -------------- */
function assertString(v: FormDataEntryValue | null, field: string): string {
  if (typeof v === "string") return v;
  throw new TypeError(`Campo "${field}" é obrigatório e deve ser texto`);
}

type JsonPayload = { tipo: string; valor: string; categoria?: string | null };

export async function POST(req: Request) {
  return handleRequest(async () => {
    const contentType = req.headers.get("content-type") ?? "";
    let tipo: string;
    let valor: string;
    let categoria: string | null = null;
    const anexos: { name: string; url: string }[] = [];

    /* ---------- JSON puro (sem anexos) --------------------------- */
    if (contentType.includes("application/json")) {
      const body: unknown = await req.json();

      if (
        typeof body !== "object" ||
        body === null ||
        typeof (body as JsonPayload).tipo !== "string" ||
        typeof (body as JsonPayload).valor !== "string"
      ) {
        throw new TypeError("Payload inválido");
      }

      ({ tipo, valor, categoria = null } = body as JsonPayload);
    } else {

    /* ---------- multipart/form-data (com anexos) ----------------- */
      const formData = await req.formData();
      tipo = assertString(formData.get("tipo"), "tipo");
      valor = assertString(formData.get("valor"), "valor");
      const rawCategoria = formData.get("categoria");
      categoria =
        typeof rawCategoria === "string" && rawCategoria.trim() !== ""
          ? rawCategoria
          : null;

      const files = formData.getAll("anexos") as File[];
      for (const file of files) {
        if (file && file.size > 0) anexos.push(await saveFile(file));
      }
    }

    await connectMongoDB();
    const novaTransacao = await Transacao.create({
      tipo,
      valor,
      categoria,
      anexos,
    });

    return NextResponse.json(
      {
        message: "Transação criada com sucesso",
        transacao: novaTransacao,
      },
      { status: 201 }
    );
  });
}
