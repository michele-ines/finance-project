import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

export async function GET() {
  return handleRequest(async () => {
    await connectMongoDB();
    const transacoes = await transacao.find();
    return NextResponse.json({ transacoes }, { status: 200 });
  });
}

export async function POST(request: Request) {
  return handleRequest(async () => {
    const { tipo, valor } = await request.json();
    await connectMongoDB();

    const novaTransacao = await transacao.create({ tipo, valor });

    return NextResponse.json(
      { message: "Transação criada com sucesso", transacao: novaTransacao },
      { status: 201 }
    );
  });
}