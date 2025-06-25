import connectMongoDB from "libs/mongoDB";
import transacao from "models/transacao";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get("page")  ?? "1");   // 1-based
  const limit = Number(searchParams.get("limit") ?? "20");  // padrão: 20

  await connectMongoDB();

  const [total, transacoes] = await Promise.all([
    transacao.countDocuments(),                               // total p/ front
    transacao
      .find()
      .sort({ createdAt: -1 })                                // + recentes 1º
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  return NextResponse.json({ transacoes, total }, { status: 200 });
}
