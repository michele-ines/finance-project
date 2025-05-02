import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";

import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    await connectMongoDB();
    const transacaoOb = await transacao.findOne({ _id: id });
    return NextResponse.json({ transacaoOb }, { status: 200 });
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const { nome, nacionalidade, rankingatual } = await request.json();
  await connectMongoDB();
  await transacao.findByIdAndUpdate(id, { nome, nacionalidade, rankingatual });
  return NextResponse.json(
    { message: "Transação atualizada com sucesso" },
    { status: 200 }
  );
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  console.log("DELETE", id);
  await connectMongoDB();
  await transacao.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Transação excluída com sucesso" },
    { status: 200 }
  );
}