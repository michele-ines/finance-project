import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const transacoes = await transacao.find();
  return NextResponse.json({ transacoes }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const { tipo, valor } = await request.json();

    // Conecta ao MongoDB
    await connectMongoDB();

    // Cria uma nova transação
    const novaTransacao = await transacao.create({ tipo, valor });

    return NextResponse.json(
      { message: "Transação criada com sucesso", transacao: novaTransacao },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar transação:", error);
    return NextResponse.json(
      { message: "Erro ao salvar transação", error: (error as Error).message },
      { status: 500 }
    );
  }
}