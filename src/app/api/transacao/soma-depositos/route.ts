import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

export async function GET() {
  return handleRequest(async () => {
    await connectMongoDB();

    // Soma os valores das transações do tipo "deposito"
    const resultado = await transacao.aggregate([
      { $match: { tipo: "deposito" } },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$valor" } }, // converte string para número
        },
      },
    ]);

    const total = resultado[0]?.total || 0;

    return NextResponse.json({ total }, { status: 200 });
  });
}