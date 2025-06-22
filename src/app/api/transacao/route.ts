import connectMongoDB from "libs/mongoDB";
import Transacao from "models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";


export async function GET(request: Request) {
  return handleRequest(async () => {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10"); // Definimos o padrão como 10
    const skip = (page - 1) * limit;

    await connectMongoDB();

    // 2. Executa duas consultas em paralelo: uma para os dados da página e outra para o total de documentos
    const [transacoes, total] = await Promise.all([
      Transacao
        .find()
        .sort({ createdAt: -1 }) // Ordena pela data de criação
        .skip(skip)               // Pula os documentos das páginas anteriores
        .limit(limit),            // Limita a quantidade de documentos por página
      Transacao.countDocuments()    // Conta o total de transações
    ]);
    
    // 3. Retorna os dados paginados e o total
    return NextResponse.json({ transacoes, total }, { status: 200 });
  });
}


export async function POST(req: Request) {
  return handleRequest(async () => {
    const body = await req.json();

    await connectMongoDB();
    const novaTransacao = await Transacao.create(body);

    return NextResponse.json(
      { message: "Transação criada com sucesso", transacao: novaTransacao },
      { status: 201 }
    );
  });
}
