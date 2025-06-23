// import connectMongoDB   from "@/../libs/mongoDB";
// import Transacao        from "@/../models/transacao";
// import { NextResponse } from "next/server";
// import { handleRequest } from "utils/error-handlers/error-handle";

// /* ------------------------------------------------------------------------- */
// /*  GET – lê uma transação                                                   */
// /* ------------------------------------------------------------------------- */
// export async function GET(
//   _req: Request,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;            // <-- copia já!

//   return handleRequest(async () => {
//     await connectMongoDB();

//     const transacao = await Transacao.findById(id);
//     if (!transacao) {
//       return NextResponse.json(
//         { message: "Transação não encontrada" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ transacao }, { status: 200 });
//   });
// }

// /* ------------------------------------------------------------------------- */
// /*  PUT – atualiza                                                            */
// /* ------------------------------------------------------------------------- */
// export async function PUT(
//   req: Request,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;            // <-- AVANÇA o acesso

//   return handleRequest(async () => {
//     const { tipo, valor } = await req.json();
//     await connectMongoDB();

//     const atualizada = await Transacao.findByIdAndUpdate(
//       id,
//       { tipo, valor },
//       { new: true }                          // devolve documento atualizado
//     );

//     return NextResponse.json(
//       { message: "Transação atualizada com sucesso", transacao: atualizada },
//       { status: 200 }
//     );
//   });
// }

// /* ------------------------------------------------------------------------- */
// /*  DELETE – remove                                                           */
// /* ------------------------------------------------------------------------- */
// export async function DELETE(
//   _req: Request,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;            // <-- lê antes de tudo

//   return handleRequest(async () => {
//     await connectMongoDB();
//     await Transacao.findByIdAndDelete(id);

//     return NextResponse.json(
//       { message: "Transação excluída com sucesso" },
//       { status: 200 }
//     );
//   });
// }
import connectMongoDB   from "@/../libs/mongoDB";
import Transacao        from "@/../models/transacao";
import { NextResponse } from "next/server";
import { handleRequest } from "utils/error-handlers/error-handle";

type ParamsPromise = Promise<{ id: string }>;     // ✅ sem “any”

/* ------------------------------------------------------------------ */
/*  GET                                                               */
/* ------------------------------------------------------------------ */
export async function GET(
  _req: Request,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params;                    // regra “await params”

  return handleRequest(async () => {
    await connectMongoDB();
    const transacao = await Transacao.findById(id);

    if (!transacao)
      return NextResponse.json(
        { message: "Transação não encontrada" },
        { status: 404 },
      );

    return NextResponse.json({ transacao }, { status: 200 });
  });
}

/* ------------------------------------------------------------------ */
/*  PUT                                                               */
/* ------------------------------------------------------------------ */
export async function PUT(
  req: Request,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params;                    // ✅ aguardado
  const { tipo, valor } = await req.json();

  return handleRequest(async () => {
    await connectMongoDB();

    const atualizada = await Transacao.findByIdAndUpdate(
      id,
      { tipo, valor },
      { new: true },
    );

    return NextResponse.json(
      { message: "Transação atualizada com sucesso", transacao: atualizada },
      { status: 200 },
    );
  });
}

/* ------------------------------------------------------------------ */
/*  DELETE                                                            */
/* ------------------------------------------------------------------ */
export async function DELETE(
  _req: Request,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params;                    // ✅ aguardado

  return handleRequest(async () => {
    await connectMongoDB();
    await Transacao.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Transação excluída com sucesso" },
      { status: 200 },
    );
  });
}
