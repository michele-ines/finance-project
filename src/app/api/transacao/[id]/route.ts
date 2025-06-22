import connectMongoDB from "@/../libs/mongoDB";
import Transacao from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

interface RouteContext {
  params: { id: string };          // não é Promise
}

/* ──────────── READ ──────────── */
export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  return handleRequest(async () => {
    await connectMongoDB();
    const transacao = await Transacao.findById(params.id);

    if (!transacao) {
      return NextResponse.json(
        { message: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ transacao }, { status: 200 });
  });
}

/* ──────────── UPDATE ─────────── */
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  return handleRequest(async () => {
    const { tipo, valor } = await req.json();

    await connectMongoDB();
    const atualizada = await Transacao.findByIdAndUpdate(
      params.id,
      { tipo, valor },
      { new: true }                 // devolve o documento atualizado
    );

    return NextResponse.json(
      { message: "Transação atualizada com sucesso", transacao: atualizada },
      { status: 200 }
    );
  });
}

/* ──────────── DELETE ─────────── */
export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  return handleRequest(async () => {
    await connectMongoDB();
    await Transacao.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Transação excluída com sucesso" },
      { status: 200 }
    );
  });
}
