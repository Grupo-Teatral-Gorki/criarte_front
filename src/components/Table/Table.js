import React from "react";
import PropTypes from "prop-types";

function Table({ dados }) {
  const cellStyle = {
    padding: "20px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
    color: "#1d4a5d",
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Roboto, Arial, sans-serif" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          fontSize: "18px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#1d4a5d", color: "white" }}>
            {[
              "Data Inicial",
              "Nome do Proejto",
              "Número de Inscrição",
              "Proponente",
            ].map((header) => (
              <th
                key={header}
                style={{
                  padding: "20px",
                  textAlign: "left",
                  fontWeight: "bold",
                  borderBottom: "2px solid #ccc",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(dados) && dados.length > 0 ? (
            dados.map((item, index) => (
              <tr
                key={item.numeroInscricao}
                style={{
                  backgroundColor: index % 2 === 0 ? "#e9f4f8" : "#ffffff",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cce7ef")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#e9f4f8" : "#ffffff")
                }
              >
                <td style={cellStyle}>{item.dataInicial}</td>
                <td style={cellStyle}>{item.Projeto}</td>
                <td style={cellStyle}>{item.numeroInscricao}</td>
                <td style={cellStyle}>{item.proponente}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                Nenhum dado disponível
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// PropTypes validation
Table.propTypes = {
  dados: PropTypes.arrayOf(
    PropTypes.shape({
      dataInicial: PropTypes.string.isRequired,
      nomeProjeto: PropTypes.string.isRequired,
      numeroInscricao: PropTypes.string.isRequired,
      proponente: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Table;
