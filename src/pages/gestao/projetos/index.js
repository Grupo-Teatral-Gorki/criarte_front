import React from "react";
import Header from "../../../components/Header/Header";
import CardGestao from "../../../components/CardGestao/CardGestao";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { date: "16/11/24", rascunho: 25, enviados: 30, amt: 20 },
  { date: "17/11/24", rascunho: 18, enviados: 22, amt: 19 },
  { date: "18/11/24", rascunho: 10, enviados: 15, amt: 12 },
  { date: "19/11/24", rascunho: 30, enviados: 35, amt: 28 },
  { date: "20/11/24", rascunho: 22, enviados: 29, amt: 25 },
  { date: "21/11/24", rascunho: 14, enviados: 20, amt: 18 },
  { date: "22/11/24", rascunho: 19, enviados: 26, amt: 21 },
  { date: "23/11/24", rascunho: 28, enviados: 34, amt: 30 },
  { date: "24/11/24", rascunho: 15, enviados: 23, amt: 17 },
  { date: "25/11/24", rascunho: 12, enviados: 19, amt: 14 },
];

const data2 = [
  { name: "Rascunhos", value: 30 },
  { name: "Enviados", value: 20 },
  { name: "Habilitados", value: 25 },
  { name: "Recursos", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const GestaoProjetos = () => {
  const municipio = "Santa Rita";
  return (
    <div className="container-gestao">
      <Header />
      <h2 className="title-gestao">Projetos de {municipio}</h2>
      <div className="container-cards-gestao">
        <CardGestao titulo={"Projetos Enviados"} valor={10} />
        <CardGestao titulo={"Projetos em Raschunho"} valor={10} />
        <CardGestao titulo={"Projetos em Recurso"} valor={10} />
      </div>
      <div className="container-info-gestao">
        <div className="container-graficos-gestao">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="enviados"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="rascunho" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="container-graficos-gestao">
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <PieChart width={400} height={400}>
              <Tooltip />
              <Pie
                data={data2}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {data2.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
            <p>26-11-2024</p>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GestaoProjetos;
