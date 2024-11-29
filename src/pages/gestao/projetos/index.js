import React, { useEffect, useState } from "react";
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
import TabsWithTable from "../../../components/TabsWithTable/TabsWithTable";
import Header from "../../../components/header/header";

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

const COLORS = ["#1d4a5d", "#00C49F", "#FFBB28", "#FF8042"];

const GestaoProjetos = () => {
  const [municipio, setMunicipio] = useState("");
  const [projetos, setProjetos] = useState();

  const cityNames = {
    3842: "Serrana",
    3798: "Santa Rita Do Passa Quatro",
    3357: "Brodowski",
    3823: "São José Do Rio Pardo",
    3398: "Cerquilho",
    3478: "Guariba",
  };

  function getCityName(number) {
    return cityNames[number];
  }

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setMunicipio(getCityName(userDetails.idCidade));
  }, []);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `https://api.grupogorki.com.br/api/projeto/listaProjetos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const formatted = getStatusesCount(data.data);
          setProjetos(formatted);
        }
      } catch (error) {
        console.error("Erro ao carregar projetos.", error);
      }
    };

    fetchProjectInfo();
  }, []);

  function normalizeStatus(status) {
    // Return null if status is null, otherwise normalize it (lowercase and remove special characters)
    if (status === null) return null;
    return status.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function getStatusesCount(items) {
    const statusCount = { total: 0 };
    const statusItems = {};

    items.forEach((item) => {
      const normalizedStatus = normalizeStatus(item.status);

      statusCount.total++;

      if (normalizedStatus !== null) {
        if (statusCount[normalizedStatus]) {
          statusCount[normalizedStatus]++;
        } else {
          statusCount[normalizedStatus] = 1;
        }
        if (statusItems[normalizedStatus]) {
          statusItems[normalizedStatus].push(item);
        } else {
          statusItems[normalizedStatus] = [item];
        }
      }
    });

    return {
      countByStatus: statusCount,
      itemsByStatus: statusItems,
    };
  }

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Gestão de Projetos: {municipio}</h2>

        <div style={styles.cardContainer}>
          <CardGestao
            titulo="Projetos Enviados"
            valor={projetos?.countByStatus.enviado}
          />
          <CardGestao
            titulo="Projetos em Habilitação"
            valor={projetos?.countByStatus.habilitao}
          />
          <CardGestao
            titulo="Projetos em Rascunho"
            valor={projetos?.countByStatus.rascunho}
          />
          <CardGestao
            titulo="Projetos em Recurso"
            valor={projetos?.countByStatus.recurso}
          />
          <CardGestao
            titulo="Total de Projetos"
            valor={projetos?.countByStatus.total}
          />
        </div>

        <div style={styles.chartsContainer}>
          <div style={styles.chart}>
            <h3 style={styles.chartTitle}>Projetos por Dia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
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
                  stroke="#1d4a5d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="rascunho"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chart}>
            <h3 style={styles.chartTitle}>Resumo de Projetos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={data2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
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
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Detalhes dos Projetos</h3>
          {projetos && <TabsWithTable data={projetos.itemsByStatus} />}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    fontFamily: "Roboto, Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    color: "#1d4a5d",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    color: "#1d4a5d",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "40px",
  },
  chartsContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "40px",
  },
  chart: {
    flex: 1,
    margin: "0 20px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "20px",
    color: "#1d4a5d",
  },
  tableContainer: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  tableTitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "20px",
    color: "#1d4a5d",
  },
};

export default GestaoProjetos;
