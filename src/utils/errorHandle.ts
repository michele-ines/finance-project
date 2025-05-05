import { NextResponse } from "next/server";

export async function handleRequest(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}