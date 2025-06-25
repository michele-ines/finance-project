import mongoose, { Schema, Document, Model } from "mongoose";

interface AttachmentSchema {
  name: string
  url:  string
}

interface ITransacao extends Document {
    tipo: string;
    valor: string;
      anexos?:  AttachmentSchema[]

}

const transacaoSchema = new Schema<ITransacao>(
    {
        tipo: { type: String, required: true },
        valor: { type: String, required: true },
            anexos:[                                   // 👈 array opcional
      {
        name: String,
        url:  String,
        _id:  false
      }
    ]
    },
    { timestamps: true }
);

const Transacoes: Model<ITransacao> =
    mongoose.models.Transacoes || mongoose.model<ITransacao>("Transacoes", transacaoSchema);

export default Transacoes;