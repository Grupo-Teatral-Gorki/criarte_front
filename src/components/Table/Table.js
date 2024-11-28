import React from "react";

const projetos = [
  {
    id_projeto: 1,
    nome_projeto:
      "Desenvolvimento e Implementação de uma Plataforma Avançada de Gestão Integrada para Micro e Pequenas Empresas",
    resumo_projeto:
      "Este projeto visa o desenvolvimento de uma solução tecnológica inovadora e abrangente para atender às necessidades operacionais e gerenciais de micro e pequenas empresas, incluindo ferramentas para gestão financeira, controle de inventário, análise de dados e relacionamento com clientes, tudo em uma plataforma unificada e fácil de usar.",
    descricao:
      "A plataforma será baseada em tecnologias modernas como inteligência artificial e computação em nuvem, permitindo que as empresas tenham acesso a insights acionáveis e automação de processos administrativos. O projeto será dividido em várias etapas, começando com a coleta de requisitos, seguida do design de interface, desenvolvimento de módulos e testes detalhados antes da implantação final.",
    nome_modalidade: "Desenvolvimento de Software Empresarial Avançado",
    modulo_projeto: "Módulo Inicial - Pesquisa e Levantamento de Requisitos",
    proponentes: [
      "Ana Maria Silva",
      "Carlos Alberto de Souza",
      "Paulo Henrique",
    ],
  },
  {
    id_projeto: 2,
    nome_projeto:
      "Pesquisa Avançada para o Desenvolvimento de Fontes Sustentáveis de Energia Renovável em Comunidades Rurais",
    resumo_projeto:
      "O objetivo deste projeto é criar soluções de energia sustentável, explorando recursos como energia solar, biomassa e sistemas híbridos, com foco na aplicabilidade prática e na acessibilidade para comunidades em regiões remotas do Brasil.",
    descricao:
      "O projeto envolverá uma análise detalhada das condições locais, incluindo clima, recursos naturais e infraestrutura existente. Prototipagem de sistemas de energia renovável será realizada para criar soluções de baixo custo e alta eficiência. Além disso, serão implementados programas educacionais para as comunidades utilizarem as novas tecnologias de forma eficaz.",
    nome_modalidade: "Pesquisa em Energia Renovável e Sustentável",
    modulo_projeto: "Prototipagem e Testes Práticos em Campo",
    proponentes: [
      "João Pedro Oliveira",
      "Fernanda Costa",
      "Lucas Mendes",
      "Mariana Oliveira",
    ],
  },
];

function ProjetoTable(dados) {
  //TODO
  //Tipos: enviado, habilitao, rascunho, recurso
  //Adicionar Tabs de cada tipo e nessas tabs mostrar uma tabela com os itens de tal tipo, adicionar paginação
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
              "ID",
              "Nome do Projeto",
              "Resumo",
              "Descrição",
              "Modalidade",
              "Módulo",
              "Proponentes",
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
          {projetos.map((projeto, index) => (
            <tr
              key={projeto.id_projeto}
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
              <td style={cellStyle}>{projeto.id_projeto}</td>
              <td style={cellStyle}>{projeto.nome_projeto}</td>
              <td style={cellStyle}>{projeto.resumo_projeto}</td>
              <td style={cellStyle}>{projeto.descricao}</td>
              <td style={cellStyle}>{projeto.nome_modalidade}</td>
              <td style={cellStyle}>{projeto.modulo_projeto}</td>
              <td style={cellStyle}>{projeto.proponentes.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  padding: "20px",
  borderBottom: "1px solid #ddd",
  verticalAlign: "top",
  color: "#1d4a5d",
};

export default ProjetoTable;
