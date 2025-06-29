import { NextResponse } from "next/server"
import { mkdir, stat, writeFile } from "fs/promises"
import path from "path"
import connectMongoDB from "libs/mongoDB"
import Transacao from "models/transacao"
import { handleRequest } from "utils/error-handlers/error-handle"

export const runtime = "nodejs"         // 👈 permite fs no RSC

/* ------------------------------------------------------------------ */
/*  GET – paginação                                                   */
/* ------------------------------------------------------------------ */
export async function GET(request: Request) {
  return handleRequest(async () => {
    const { searchParams } = new URL(request.url)
    const page  = Number(searchParams.get("page")  ?? "1")
    const limit = Number(searchParams.get("limit") ?? "10")
    const skip  = (page - 1) * limit

    await connectMongoDB()

    const [transacoes, total] = await Promise.all([
      Transacao.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transacao.countDocuments()
    ])

    return NextResponse.json({ transacoes, total }, { status: 200 })
  })
}

/* ------------------------------------------------------------------ */
/*  POST – cria nova transação + anexos                               */
/* ------------------------------------------------------------------ */
async function saveFile(file: File) {
  const buffer      = Buffer.from(await file.arrayBuffer())
  const uploadsDir  = path.join(process.cwd(), "public", "uploads")
  try { await stat(uploadsDir) } catch { await mkdir(uploadsDir, { recursive: true }) }

  const safeName    = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
  const filePath    = path.join(uploadsDir, safeName)
  await writeFile(filePath, buffer)
  return { name: file.name, url: `/uploads/${safeName}` }
}

export async function POST(req: Request) {
  return handleRequest(async () => {
    const contentType = req.headers.get("content-type") ?? "";
    let tipo: string, valor: string, categoria: string | null = null;
    let anexos: { name: string; url: string }[] = [];

    if (contentType.includes("application/json")) {
      // Recebe JSON puro (sem anexos)
      const body = await req.json();
      tipo = String(body.tipo);
      valor = String(body.valor);
      categoria = body.categoria?.toString() ?? null;
      anexos = [];
    } else {
      // Recebe multipart/form-data (com anexos)
      const formData = await req.formData();
      tipo = String(formData.get("tipo"));
      valor = String(formData.get("valor"));
      categoria = formData.get("categoria")?.toString() ?? null;

      const files = formData.getAll("anexos") as File[];
      for (const file of files) {
        if (file && file.size > 0) {
          anexos.push(await saveFile(file));
        }
      }
    }

    await connectMongoDB();
    const novaTransacao = await Transacao.create({ tipo, valor, categoria, anexos });

    return NextResponse.json(
      { message: "Transação criada com sucesso", transacao: novaTransacao },
      { status: 201 }
    );
  });
}
