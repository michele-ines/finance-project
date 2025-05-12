import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

export async function GET() {
  return handleRequest(async () => {
    await connectMongoDB();
    const transacoes = await transacao
      .find()
      .sort({ createdAt: -1 }) // Ordena pela data de criação em ordem decrescente
      .limit(5); // Limita o resultado aos últimos 10 registros
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