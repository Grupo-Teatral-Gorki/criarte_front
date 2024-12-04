/* eslint-disable react/prop-types */
import React, { useState } from "react";

function Table({ dados }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(dados.length / itemsPerPage);

  const currentData = dados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cellStyle = {
    padding: "20px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
    color: "#1d4a5d",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "10px",
  };

  const buttonStyle = {
    padding: "10px 15px",
    border: "1px solid #1d4a5d",
    backgroundColor: "#e9f4f8",
    color: "#1d4a5d",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#1d4a5d",
    color: "white",
  };

  return (
    <div style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
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
              "ID do Projeto",
              "Nome do Projeto",
              "Modalidade",
              "Resumo do Projeto",
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
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr
                key={item.id_projeto}
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
                <td style={cellStyle}>{item.id_projeto}</td>
                <td style={cellStyle}>{item.nome_projeto}</td>
                <td style={cellStyle}>{item.nome_modalidade}</td>
                <td style={cellStyle}>{item.resumo_projeto}</td>
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

      {/* Pagination */}
      <div style={paginationStyle}>
        <button
          style={
            currentPage === 1
              ? { ...buttonStyle, cursor: "not-allowed", opacity: 0.6 }
              : buttonStyle
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            style={currentPage === index + 1 ? activeButtonStyle : buttonStyle}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          style={
            currentPage === totalPages
              ? { ...buttonStyle, cursor: "not-allowed", opacity: 0.6 }
              : buttonStyle
          }
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Table;
