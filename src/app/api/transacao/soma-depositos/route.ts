import connectMongoDB from "libs/mongoDB";
import transacao from "models/transacao";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const transacoesParaSomar = await transacao.find({
      tipo: { $in: ["deposito", "cambio", "transferencia"] }
    }).lean();

    let total = 0;
    for (const tx of transacoesParaSomar) {
      const valorNumerico = parseFloat(tx.valor) || 0;

      if (tx.tipo === 'transferencia') {
        total -= valorNumerico;
      } else {
        total += valorNumerico;
      }
    }
    return NextResponse.json({ total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro no servidor ao calcular o saldo.", error: (error as Error).message },
      { status: 500 }
    );
  }
}