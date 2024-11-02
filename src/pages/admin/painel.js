import { useEffect, useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import Header from "../../components/Header/Header";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress"; // Importa o CircularProgress para o spinner
import AdminPrivateRoute from "../../components/AdminPrivateRoute";

const TableHeaderColor = "#1d4a5d";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [projeto, setProjeto] = React.useState(null);
  const [loading, setLoading] = React.useState(false); // Adiciona estado de loading

  const renderStatusIcon = (status) => {
    switch (status) {
      case "enviado":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon style={{ color: "green" }} /> Enviado
          </div>
        );
      case "Habilitação":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon style={{ color: "blue" }} /> Habilitação
          </div>
        );
      case "Recurso":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NewReleasesIcon style={{ color: "red" }} /> Recurso
          </div>
        );
      default:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NewReleasesIcon style={{ color: "orange" }} /> Pendente
          </div>
        );
    }
  };

  const handleDownload = (projectNumber) => {
    fetch(
      `https://gorki-aws-acess-api.iglgxt.easypanel.host/download-zip/${projectNumber}/3798`,
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `projeto-${projectNumber}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error("Error downloading zip:", error);
      });
  };

  const handleClickOpen = () => {
    setLoading(true); // Ativa o estado de loading
    fetch("https://apiv3.styxx.com.br/projeto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: row.id_projeto }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Acessa o objeto dentro do índice 0, se aplicável
        const projeto = data[0] || data;

        console.log("Dados recebidos da API:", projeto);

        // Faz o parse de descricao se necessário
        try {
          const descricao =
            typeof projeto.descricao === "string"
              ? JSON.parse(projeto.descricao)
              : projeto.descricao;
          const projetoAtualizado = { ...projeto, descricao };
          setProjeto(projetoAtualizado);
          console.log("Estado do projeto atualizado:", projetoAtualizado);
          setDialogOpen(true);
        } catch (error) {
          console.error("Erro ao fazer parse do JSON:", error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [integrantes, setIntegrantes] = React.useState([]); // Estado para armazenar os integrantes
  const [integrantesDialogOpen, setIntegrantesDialogOpen] =
    React.useState(false); // Estado para controlar o modal dos integrantes

  const handleClickOpenIntegrantes = () => {
    if (!row.id_projeto) {
      console.error("id_projeto não está definido");
      return;
    }

    setLoading(true);
    fetch("https://apiv3.styxx.com.br/projeto/integrante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_projeto: row.id_projeto }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados dos integrantes recebidos:", data); // Debug
        setIntegrantes(data);
        setIntegrantesDialogOpen(true); // Abre o modal após receber os dados
      })
      .catch((error) => {
        console.error("Erro ao buscar os integrantes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Função para fechar o modal
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIntegrantes([]); // Reseta os integrantes ao fechar
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.nome_proponente}
        </TableCell>
        <TableCell align="center">
          {new Date(row.data_prevista_inicio).toLocaleDateString()}
        </TableCell>
        <TableCell align="center">{renderStatusIcon(row.status)}</TableCell>
        <TableCell align="center">{row.nome_modalidade || "N/A"} </TableCell>
        <TableCell align="center">{row.id_projeto}</TableCell>
        <TableCell align="center">{row.id_edital || "2"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalhes do Proponente
              </Typography>
              <p>
                <strong style={{ fontWeight: "bold" }}>
                  Nome do Proponente:
                </strong>{" "}
                {row.nome_proponente}
              </p>
              <p>
                <strong style={{ fontWeight: "bold" }}>Id do Usuário:</strong>{" "}
                {row.id_usuario}
              </p>
              <p>
                <strong style={{ fontWeight: "bold" }}>
                  Id do Proponente:
                </strong>{" "}
                {row.id_proponente}
              </p>
              <p>
                <strong style={{ fontWeight: "bold" }}>
                  Email do Proponente:
                </strong>{" "}
                {row.email}
              </p>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleDownload(row.id_projeto)}
                style={{ marginTop: "20px" }}
              >
                Baixar Documentos
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpenIntegrantes}
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                Ver Integrantes
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#1d4a5d",
                  marginTop: "20px",
                }}
              >
                Ver Detalhes do Projeto
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {integrantesDialogOpen && (
        <Dialog
          open={integrantesDialogOpen}
          onClose={() => setIntegrantesDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              width: "70vw",
              maxWidth: "70vw",
            },
          }}
        >
          <DialogTitle>Integrantes do Projeto</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {loading ? (
                <CircularProgress />
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Nome Completo
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>CPF</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Função</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {integrantes.length > 0 ? (
                      integrantes.map((integrante, index) => (
                        <TableRow key={index}>
                          <TableCell>{integrante.nome_completo}</TableCell>
                          <TableCell>{integrante.cpf}</TableCell>
                          <TableCell>{integrante.funcao}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          Nenhum integrante encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIntegrantesDialogOpen(false)}
              color="primary"
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md" // Define um tamanho máximo para o diálogo
          fullWidth // Faz o diálogo ocupar toda a largura disponível
          PaperProps={{
            style: {
              width: "70vw", // Define a largura do diálogo como 70% da largura da tela
              maxWidth: "70vw", // Define a largura máxima do diálogo
            },
          }}
        >
          <DialogTitle>Detalhes do Projeto</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {loading ? (
                <CircularProgress />
              ) : (
                projeto && (
                  <div>
                    <p style={{ marginBottom: "20px" }}>
                      <strong style={{ fontWeight: "bold", color: "black" }}>
                        Nome:
                      </strong>{" "}
                      {projeto.nome_projeto}
                    </p>
                    <p style={{ marginBottom: "20px" }}>
                      <strong style={{ fontWeight: "bold", color: "black" }}>
                        Resumo:
                      </strong>{" "}
                      {projeto.resumo_projeto}
                    </p>
                    {projeto.descricao && (
                      <>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Relevância:
                          </strong>{" "}
                          {projeto.descricao.relevancia || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Perfil:
                          </strong>{" "}
                          {projeto.descricao.perfil || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Expectativa:
                          </strong>{" "}
                          {projeto.descricao.expectativa || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Contrapartida:
                          </strong>{" "}
                          {projeto.descricao.contrapartida || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Divulgação:
                          </strong>{" "}
                          {projeto.descricao.divulgacao || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Democratização:
                          </strong>{" "}
                          {projeto.descricao.democratizacao || "N/A"}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <strong
                            style={{ fontWeight: "bold", color: "black" }}
                          >
                            Outras Informações:
                          </strong>{" "}
                          {projeto.descricao.outras || "N/A"}
                        </p>
                      </>
                    )}
                  </div>
                )
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default function Painel() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://apiv3.styxx.com.br/projetos/resumo",
        );
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRows = rows.filter(
    (row) =>
      (row.nome_proponente
        ? row.nome_proponente.toLowerCase()
        : "N/A"
      ).includes(searchTerm.toLowerCase()) ||
      (row.id_projeto ? row.id_projeto.toString() : "N/A").includes(
        searchTerm,
      ) ||
      (row.nome_modalidade
        ? row.nome_modalidade.toLowerCase()
        : "N/A"
      ).includes(searchTerm.toLowerCase()) ||
      (row.status ? row.status.toLowerCase() : "N/A").includes(
        searchTerm.toLowerCase(),
      ),
  );

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div>
      <AdminPrivateRoute></AdminPrivateRoute>

      <Header />
      <div className="overview-container">
        <div className="overview-data">
          <div className="data">
            <div className="data-card">
              <div className="card-title">
                <p>Região</p>
              </div>
              <div className="card-content">
                <p>Brodowski</p>
              </div>
            </div>

            <div className="data-card">
              <div className="card-title">
                <p>Projetos</p>
              </div>
              <div className="card-content">
                <p>40</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overview-table">
        <Box sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
          <Paper sx={{ width: "100%", marginBottom: 2 }}>
            <TableContainer component={Paper}>
              <TextField
                variant="filled"
                value={searchTerm}
                label="Pesquisar"
                onChange={handleSearchChange}
                style={{ margin: "16px", maxWidth: "100%" }}
                InputLabelProps={{ style: { marginTop: "-8px" } }} // Ajuste o valor conforme necessário
              />
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      Proponente
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      Data Início
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      Modalidade
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      ID Projeto
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: TableHeaderColor, fontWeight: "bold" }}
                    >
                      ID Edital
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <Row key={row.id_projeto} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 16, 24]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
}
