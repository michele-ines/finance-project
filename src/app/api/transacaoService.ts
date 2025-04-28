import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const transacoes = await transacao.find();
  return NextResponse.json({ transacoes }, { status: 200 });
}

export async function POST(request: Request) {
  const { tipo,valor } = await request.json();
  await connectMongoDB();
  await transacao.create({ tipo,valor} );
  return NextResponse.json(
    { message: "Transação criada com sucesso" },
    { status: 200 }
  );
}