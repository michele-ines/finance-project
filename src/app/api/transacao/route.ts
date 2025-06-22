import connectMongoDB from "libs/mongoDB";
import Transacao from "models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

/* ──────────── LIST / SCROLL INFINITO ─────────── */
export async function GET(req: Request) {
  return handleRequest(async () => {
    const { searchParams } = new URL(req.url);
    const page  = Number(searchParams.get("page")  ?? "1");   // 1-based
    const limit = Number(searchParams.get("limit") ?? "20");  // padrão 20

    await connectMongoDB();
    const [total, transacoes] = await Promise.all([
      Transacao.countDocuments(),
      Transacao.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return NextResponse.json({ transacoes, total }, { status: 200 });
  });
}

/* ──────────── CREATE ─────────── */
export async function POST(req: Request) {
  return handleRequest(async () => {
    const body = await req.json();

    await connectMongoDB();
    const novaTransacao = await Transacao.create(body);

    return NextResponse.json(
      { message: "Transação criada com sucesso", transacao: novaTransacao },
      { status: 201 }
    );
  });
}
