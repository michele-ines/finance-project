import mongoose, { Schema, Document, Model } from "mongoose";

interface ITransacao extends Document {
    tipo: string;
    valor: string;
}

const transacaoSchema = new Schema<ITransacao>(
    {
        tipo: { type: String, required: true },
        valor: { type: String, required: true },
    },
    { timestamps: true }
);

const Transacoes: Model<ITransacao> =
    mongoose.models.Transacoes || mongoose.model<ITransacao>("Transacoes", transacaoSchema);

export default Transacoes;