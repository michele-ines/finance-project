"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", valor: 1200 },
  { name: "Fev", valor: 2100 },
  { name: "Mar", valor: 800 },
  { name: "Abr", valor: 1600 },
  { name: "Mai", valor: 900 },
  { name: "Jun", valor: 1700 },
];

export default function FinancialChart() {
  return (
    /* região nomeada para leitores de tela */
    <div
      className="w-full h-64"
      role="region"
      aria-labelledby="financial-chart-heading"
    >
      {/* título só para leitores de tela (sr-only) */}
      <h3 id="financial-chart-heading" className="sr-only">
        Gráfico financeiro: valores mensais de Janeiro a Junho
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        {/* o próprio SVG ganha role="img" e nome acessível */}
        <LineChart
          data={data}
          role="img"
          aria-label="Gráfico de linha mostrando a variação de valores de Janeiro a Junho"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#000", fontSize: 12 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <YAxis
            tick={{ fill: "#000", fontSize: 12 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#00C853"
            strokeWidth={3}
            dot={{ stroke: "#00C853", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
