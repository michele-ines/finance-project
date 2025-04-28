import mongoose, { Schema } from "mongoose";

const transacaoSchema = new Schema(
  {
    tipo: String,
    valor: String,
   
  },
  { timestamps: true }
);

const Transacoes =
  mongoose.models.Transacoes || mongoose.model("Transacoes", transacaoSchema);

export default Transacoes;