import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

// Tipo correto para o contexto de rotas dinâmicas
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  return handleRequest(async () => {
    const { id } = await context.params; // Use await para acessar os parâmetros

    await connectMongoDB();
    const transacaoOb = await transacao.findOne({ _id: id });
    if (!transacaoOb) {
      return NextResponse.json(
        { message: "Transação não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ transacaoOb }, { status: 200 });
  });
}

export async function PUT(request: Request, context: RouteContext) {
  return handleRequest(async () => {
    const { id } = await context.params; // Use await para acessar os parâmetros
    const { tipo, valor } = await request.json();

    await connectMongoDB();
    await transacao.findByIdAndUpdate(id, { tipo, valor });

    return NextResponse.json(
      { message: "Transação atualizada com sucesso" },
      { status: 200 }
    );
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleRequest(async () => {
    const { id } = await context.params; // Use await para acessar os parâmetros

    await connectMongoDB();
    await transacao.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Transação excluída com sucesso" },
      { status: 200 }
    );
  });
}