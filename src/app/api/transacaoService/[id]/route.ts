import connectMongoDB from "@/../libs/mongoDB";
import transacao from "@/../models/transacao";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        await connectMongoDB();
        const transacaoOb = await transacao.findOne({ _id: id });
        if (!transacaoOb) {
            return NextResponse.json(
                { message: "Transação não encontrada" },
                { status: 404 }
            );
        }
        return NextResponse.json({ transacaoOb }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao buscar a transação", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const { nome, nacionalidade, rankingatual } = await request.json();
        await connectMongoDB();
        await transacao.findByIdAndUpdate(id, { nome, nacionalidade, rankingatual });
        return NextResponse.json(
            { message: "Transação atualizada com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao atualizar a transação", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        console.log("DELETE", id);
        await connectMongoDB();
        await transacao.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "Transação excluída com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao excluir a transação", error: (error as Error).message },
            { status: 500 }
        );
    }
}