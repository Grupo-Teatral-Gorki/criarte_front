/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import PrivateRoute from "../../components/PrivateRoute";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Header from "../../components/header/header";

const DocumentUploadForm = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [idEdital, setIdEdital] = useState(null); // Estado para armazenar id_edital
  const [storageUserDetails, setStorageUserDetails] = useState(null);
  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);
  const [isCotista, setIsCotista] = useState(false);
  const [tipoProponente, setTipoProponente] = useState(null);

  useEffect(() => {
    const fetchProponentes = async () => {
      const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/getProponenteByUser`;
      const token = localStorage.getItem("authToken");
      const userDetails = localStorage.getItem("userDetails");
      const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;
      const idUsuario = parsedUserDetails ? parsedUserDetails.id : null;

      if (!idUsuario) {
        console.error("ID de usuário não encontrado em localStorage");
        setError("Erro ao encontrar o usuário.");
        return;
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idUsuario }),
        });

        if (!response.ok) {
          throw new Error("Nenhum proponente encontrado");
        }

        const data = await response.json();
        console.log("Dados recebidos com sucesso:", data);
        localStorage.setItem(
          "tipoProponente",
          data.proponentes[0].cpf_responsavel ? "PF" : "PJ"
        );
      } catch (error) {
        console.error("Erro ao receber os proponentes:", error);
        setError(error.message);
      }
    };

    fetchProponentes();
  }, []);

  const pontalPF = [
    {
      name: "doc-photo-id-1",
      label:
        "Cópia digitalizada de um único documento com foto do proponente, constando número do CPF e RG (carteira de identidade, CNH, outros...).",
      required: true,
    },
    {
      name: "proof-address-pontal-2",
      label:
        "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Pontal, retroativo a outubro de 2022.",
      required: true,
    },
    {
      name: "proof-address-current-3",
      label: "Comprovante de endereço atual, datado a partir de junho de 2024.",
      required: true,
    },
    {
      name: "self-declaration-residence-4",
      label: "Autodeclaração de residência (Anexo II).",
    },
    {
      name: "curriculum-proponente",
      label: "Currículo do proponente",
      required: true,
    },
    {
      name: "curriculum-portfolio-collective",
      label: "Currículo ou portfólio de Coletivo ou idealizador",
      required: true,
    },
    {
      name: "technical-sheet-participants",
      label:
        "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
      required: true,
    },
    {
      name: "commitment-terms",
      label:
        "Termos de Compromissos assinados pelos principais integrantes do projeto (Anexo V)",
      required: true,
    },
    {
      name: "copyright-declaration",
      label:
        "Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais (Anexo III)",
      required: true,
    },
  ];

  const pontalPJ = [
    {
      name: "id-representative-1",
      label:
        "Documento de Identidade ou outro documento com força legal que contenha o número de R.G. e foto do(s) seu(s) representante(s) legal(is).",
      required: true,
    },
    {
      name: "cpf-representative-2",
      label:
        "CPF, caso o documento com força legal não contenha o número do CPF do(s) seu(s) representante(s) legal(is).",
      required: true,
    },
    {
      name: "cnpj-mei-card-3",
      label: "Cartão do CNPJ ou Requerimento de Microempreendedor Individual.",
      required: true,
    },
    {
      name: "address-proof-ribeirao-4",
      label:
        "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Pontal, retroativo a Dezembro de 2022, em nome da Instituição ou do proponente inscrito como M.E.I.",
      required: true,
    },
    {
      name: "current-address-proof-5",
      label:
        "Comprovante de endereço atual, datado a partir de Dezembro de 2024.",
      required: true,
    },
    {
      name: "social-contract-6",
      label: "Contrato Social ou do Estatuto e demais alterações.",
      required: true,
    },
    {
      name: "election-minutes-7",
      label: "Ata de eleição e posse da diretoria, quando for o caso.",
    },
    {
      name: "curriculum-proponente",
      label: "Currículo do proponente",
      required: true,
    },
    {
      name: "curriculum-portfolio-collective",
      label: "Currículo ou portfólio de Coletivo ou idealizador",
      required: true,
    },
    {
      name: "technical-sheet-participants",
      label:
        "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
      required: true,
    },
    {
      name: "commitment-terms",
      label:
        "Termos de Compromissos assinados pelos principais integrantes do projeto (Anexo V)",
      required: true,
    },
    {
      name: "copyright-declaration",
      label:
        "Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais (Anexo III)",
      required: true,
    },
  ];

  const pontalProjeto = [
    {
      name: "execution-schedule",
      label: "Cronograma de execução",
      required: true,
    },
    {
      name: "ethnic-declaration",
      label:
        "Quando for o caso inserir Declaração Étnico-racial (Anexo VII) e/ou Declaração de Pessoa com Deficiência (Anexo VIII)",
    },
    {
      name: "representation-declaration",
      label:
        "Declaração de representação, se for um coletivo sem CNPJ (Anexo VI)",
    },
    {
      name: "other-documents",
      label:
        "Outros documentos que o agente cultural julgar necessário para auxiliar na avaliação do mérito cultural do projeto",
    },
  ];

  const sanitizeFileName = (fileName) => {
    const dotIndex = fileName.lastIndexOf(".");
    const baseName = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName;
    const extension = dotIndex !== -1 ? fileName.slice(dotIndex) : "";

    const sanitizedBaseName = baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 20);

    return sanitizedBaseName + extension;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDetails = localStorage.getItem("userDetails");

      if (userDetails) {
        const parsedDetails = JSON.parse(userDetails);
        parsedDetails.idCidade = parsedDetails.idCidade ?? 0;
        setStorageUserDetails(parsedDetails);
      }
    }

    const numeroInscricaoStored = localStorage.getItem("numeroInscricao");
    const cityIdStored = storageUserDetails?.idCidade ?? 0;

    async function atualizarCotistaValue(numeroInscricaoStored) {
      try {
        const response = await fetch(
          "https://gorki-api-cotista.iglgxt.easypanel.host/projects/cotista/value",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idProjeto: numeroInscricaoStored }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao atualizar status de cotista");
        }

        const data = await response.json();
        setIsCotista(data.cotista);
      } catch (error) {
        console.error(error);
      }
    }
    atualizarCotistaValue(numeroInscricaoStored);

    const checkDownloadStatus = async () => {
      if (numeroInscricaoStored) {
        try {
          const response = await fetch(
            `https://gorki-aws-acess-api.iglgxt.easypanel.host/download-zip/${cityIdStored}/${numeroInscricaoStored}`
          );
          if (response.status === 200) {
            setIsDownloadSuccessful(true);
          } else {
            setIsDownloadSuccessful(false);
          }
        } catch (error) {
          console.error("Erro ao verificar o status do download:", error);
          setIsDownloadSuccessful(false);
        }
      }
    };

    checkDownloadStatus();

    if (numeroInscricaoStored && numeroInscricaoStored.length > 0) {
      setNumeroInscricao(numeroInscricaoStored);
      setIsLoading(false);
    } else {
      setError("Número de inscrição não encontrado.");
      setIsLoading(false);
    }

    // Simulação de chamada à API para buscar o idEdital
    const fetchIdEdital = async () => {
      try {
        const response = await fetch(
          "https://gorki-api-nome.iglgxt.easypanel.host/api/getProjeto",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario: localStorage.getItem("userEmail"),
              senha: localStorage.getItem("userPassword"),
              numeroInscricao: localStorage.getItem("numeroInscricao"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar projeto: ${response.statusText}`);
        }

        const data = await response.json();
        setIdEdital(data.projeto.id_edital); // Aqui coletamos o idEdital
        setIsLoading(false);
      } catch (error) {
        setError("Erro ao buscar o projeto.");
        setIsLoading(false);
      }
    };

    fetchIdEdital();
  }, []);

  async function atualizarCotista(idProjeto, isCotista) {
    try {
      const response = await fetch(
        "https://gorki-api-cotista.iglgxt.easypanel.host/projects/cotista",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idProjeto, isCotista }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status de cotista");
      }

      setIsCotista(isCotista);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status de cotista.");
    }
  }

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: file,
    }));
  };

  const uploadFile = async (file, fieldName) => {
    if (!numeroInscricao) {
      throw new Error("Número de inscrição do projeto não encontrado.");
    }

    const formData = new FormData();
    formData.append("IdProjeto", numeroInscricao);
    formData.append("IdTipo", 1);
    formData.append("Archive", file, sanitizeFileName(file.name)); // Usa a função sanitizeFileName

    try {
      const response = await fetch(
        "https://api.grupogorki.com.br/api/docProjeto/Create",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fieldName]: "success",
        }));
      } else {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fieldName]: "error",
        }));

        console.error(
          "Upload error:",
          response.status,
          response.statusText,
          await response.text()
        );
      }
    } catch (error) {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [fieldName]: "error",
      }));

      console.error("Upload error:", error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storedUserDetails = localStorage.getItem("userDetails");
    const userDetails = JSON.parse(storedUserDetails);

    try {
      // Track whether all files are uploaded successfully
      let allUploaded;

      // Upload each file and check for errors
      await Promise.all(
        Object.keys(files).map(async (fieldName) => {
          try {
            await uploadFile(files[fieldName], fieldName);
            allUploaded = true;
          } catch (error) {
            console.error(
              `Error uploading file for field ${fieldName}:`,
              error
            );
            allUploaded = false; // Set to false if any file upload fails
          }
        })
      );

      // Only set setAllFilesUploaded to true if all uploads were successful
      if (allUploaded) {
        setAllFilesUploaded(true);
      }

      // Perform the API request if files are successfully uploaded
      if (allUploaded) {
        const updateResponse = await fetch(
          "https://api.grupogorki.com.br/api/projeto/updateProjeto",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idProponente: userDetails.id,
            }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error(
            `Erro ao atualizar o projeto: ${updateResponse.status} ${updateResponse.statusText}`
          );
        }

        console.log(
          "Projeto atualizado com sucesso:",
          await updateResponse.json()
        );
      } else {
        throw new Error("Not all files were uploaded successfully.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const UploadField = ({
    name,
    label,
    exampleLink,
    exampleText,
    required = false,
  }) => (
    <Card
      sx={{
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "700px",
        width: "800px",
        margin: "auto",
        mb: 2,
      }}
    >
      {exampleLink && <a href={exampleLink}>{exampleText}</a>}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {label}
        </Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Selecione o arquivo aqui
          </Typography>
          {files[name] && <p>{files[name].name}</p>}
          <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
            Arquivos Suportados: PDF
          </Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: "none" }}
            id={`upload-${name}`}
            required={required}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="outlined" component="span">
              SELECIONAR
            </Button>
          </label>
        </UploadBox>
        {uploadStatus[name] === "success" && (
          <Alert severity="success">Arquivo enviado com sucesso!</Alert>
        )}
        {uploadStatus[name] === "error" && (
          <Alert severity="error">Erro ao enviar o arquivo.</Alert>
        )}
        {uploadStatus[name] === "error" && setAllFilesUploaded(false)}
      </CardContent>
    </Card>
  );

  const UploadBox = styled("div")(({ theme }) => ({
    border: "2px dashed #ccc",
    padding: "20px",
    textAlign: "center",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#999",
    },
  }));

  const FooterAlert = () => {
    if (allFilesUploaded) {
      return (
        <Alert severity="success">
          Todos os documentos foram enviados com sucesso!
        </Alert>
      );
    } else {
      return null;
    }
  };

  function CheckRequiredDocs() {
    switch (storageUserDetails.idCidade) {
      case 3798:
        return [
          { name: "cronograma", label: "*Cronograma de execução do projeto" },
          { name: "curriculo", label: "*Curriculo do Proponente" },
          { name: "rgCpf", label: "*RG e CPF do(a) responsável técnico(a)" },
          {
            name: "curriculoEquipe",
            label:
              "*Currículo do(a)s principais integrantes da equipe técnica e artística",
          },
          {
            name: "direitosAutorais",
            label: "*Direitos autorais e conexos",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+III+-+DECLARA%C3%87%C3%83O+DE+OP%C3%87%C3%83O+DE+CESS%C3%83O+DE+DIREITOS+AUTORAIS.docx",
          },
          {
            name: "termoCompromisso",
            label: "*Termo de compromisso dos participantes",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+V+-+MODELO+DE+TERMO+DE+COMPROMISSO+DOS+PARTICIPANTES.docx",
          },
          {
            name: "comprovanteDomicilioAtual",
            label: "*Comprovantes de domicílio ou sede atual",
          },
          {
            name: "comprovanteDomicilio2Anos",
            label: "*Comprovantes de domicílio ou sede de 02 (dois) anos",
          },
          {
            name: "curriculoPortfolio",
            label: "*Curriculo ou portfólio de coletivo ou idealizador",
          },
          {
            name: "rep-coletivo",
            label:
              "Declaração de representação do Coletivo ou Grupo pelo Proponente, se tratar-se de Coletivo ou Grupo",
          },
          {
            name: "decDeficiencia",
            label: "Declaração de pessoa com deficiência",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VIII+-+DECLARA%C3%87%C3%83O+PESSOA+COM+DEFICI%C3%8ANCIA.docx",
          },
          {
            name: "decEtnicoRacial",
            label: "Declaração étnico-racial",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VII+-+MODELO+DE+DECLARA%C3%87%C3%83O+%C3%89TNICO-RACIAL.docx",
          },
          {
            name: "decResidencia",
            label: "Autodeclaração de Residência",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+II+-+AUTODECLARA%C3%87%C3%83O+DE+RESID%C3%8ANCIA.docx",
          },
          { name: "outrosDocumentos", label: "Outros documentos" },
        ];

      case 3478:
        if (idEdital !== 4) {
          return [
            {
              name: "id-doc",
              label:
                "Cópia digitalizada de um único documento com foto do proponente, constando número do CPF e RG (carteira de identidade, CNH, outros...)",
            },
            {
              name: "comp-end-2a",
              label:
                "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Guariba, retroativo a outubro de 2022",
            },
            {
              name: "comp-end5",
              label:
                "Comprovante de endereço atual, datado a partir de junho de 2024",
            },
            {
              name: "auto-red",
              label: "Autodeclaração de residência (Anexo II)",
            },
            {
              name: "comp-end2",
              label:
                "Comprovante de endereço atual, datado a partir de junho de 2024",
            },
            {
              name: "dec-dir-aut",
              label:
                "Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais (Anexo III)",
            },

            {
              name: "termos-comp",
              label:
                "Termos de Compromissos assinados pelos principais integrantes do projeto (AnexoV)",
            },
            {
              name: "cronograma",
              label: "Cronograma de execução",
            },
            {
              name: "curriculo",
              label:
                "Currículo (texto) do proponente. Caso o proponente seja também o idealizador do projeto, enviar o currículo e o portfólio conforme descrito no item abaixo",
            },
            {
              name: "portfolio",
              label:
                "Portfólio do idealizador. O Portfólio deve conter o Currículo (Texto) e COMPROVAÇÕES da atuação do Coletivo, Grupo ou idealizador contendo fotos de eventos, cópias de jornais, panfletos, e-flyers, print de divulgações em redes sociais, links de vídeos ou de páginas de redes sociais ou sites de trabalho, certificados de participação em cursos e/ou atividades diversas de cultura, cartas ou declaração de reconhecimento do trabalho cultural, da pessoa ou coletivo, emitidas por entidades, ONGs, escolas, associações, dentre outros agentes que atestem sua atuação em Cerquilho há pelo menos 1 ano, em um Único arquivo PDF.",
            },
            {
              name: "ficha-tec",
              label:
                "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
            },
            {
              name: "PJ-id-doc",
              label:
                "(PJ) Documento de Identidade ou outro documento com força legal que contenha o número de R.G. e foto do(s) seu(s) representante(s) legal(is)",
            },
            {
              name: "pj-id-doc-2",
              label:
                "(PJ) CPF, caso o documento com força legal não contenha o número do CPF do(s) seu(s)representante(s) legal(is)",
            },
            {
              name: "pj-id-doc-3",
              label:
                "(PJ) Cartão do CNPJ ou Requerimento de Microempreendedor Individual; d) Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Ribeirão Preto, retroativo a junho de 2022, em nome da Instituição ou do proponente inscrito como M.E.I.",
            },
            {
              name: "pj-id-doc-4",
              label:
                "(PJ) Comprovante de endereço atual, datado a partir de julho de 2023",
            },
            {
              name: "pj-id-doc-5",
              label: "(PJ) Contrato Social ou do Estatuto e demais alterações",
            },
            {
              name: "pj-id-doc-6",
              label:
                "(PJ) Ata de eleição e posse da diretoria, quando for o caso",
            },
            {
              name: "dem-info",
              label: "Demais informações",
            },
          ];
        } else if (idEdital === 4) {
          return [
            {
              name: "form-insc",
              label: "Formulário de inscrição (Anexo II)",
            },
            {
              name: "portf",
              label: "Portfólio",
            },
            {
              name: "docs-esp",
              label:
                "Documentos específicos relacionados na categoria de apoio em que o espaço, ambiente ou iniciativa artístico-cultural será inscrito, quando houver (Anexo I)",
            },
            {
              name: "dec-cnpj1",
              label:
                "Declaração de representação, se for um coletivo sem CNPJ (Anexo VI)",
            },
            {
              name: "outros-doc",
              label:
                "Outros documentos que o agente cultural julgar necessário para auxiliar na avaliação do mérito cultural do projeto",
            },
          ];
        }
        break;

      case 3478 && idEdital != 4:
        return [
          {
            name: "id-doc",
            label:
              "Cópia digitalizada de um único documento com foto do proponente, constando número do CPF e RG (carteira de identidade, CNH, outros...)",
          },
          {
            name: "comp-end-2a",
            label:
              "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Guariba, retroativo a outubro de 2022",
          },
          {
            name: "comp-end3",
            label:
              "Comprovante de endereço atual, datado a partir de junho de 2024",
          },
          {
            name: "auto-red",
            label: "Autodeclaração de residência (Anexo II)",
          },
          {
            name: "comp-end4",
            label:
              "Comprovante de endereço atual, datado a partir de junho de 2024",
          },

          {
            name: "termos-comp",
            label:
              "Termos de Compromissos assinados pelos principais integrantes do projeto (AnexoV)",
          },
          {
            name: "cronograma",
            label: "Cronograma de execução",
          },
          {
            name: "curriculo",
            label:
              "Currículo (texto) do proponente. Caso o proponente seja também o idealizador do projeto, enviar o currículo e o portfólio conforme descrito no item abaixo",
          },
          {
            name: "portfolio",
            label:
              "Portfólio do idealizador. O Portfólio deve conter o Currículo (Texto) e COMPROVAÇÕES da atuação do Coletivo, Grupo ou idealizador contendo fotos de eventos, cópias de jornais, panfletos, e-flyers, print de divulgações em redes sociais, links de vídeos ou de páginas de redes sociais ou sites de trabalho, certificados de participação em cursos e/ou atividades diversas de cultura, cartas ou declaração de reconhecimento do trabalho cultural, da pessoa ou coletivo, emitidas por entidades, ONGs, escolas, associações, dentre outros agentes que atestem sua atuação em Cerquilho há pelo menos 1 ano, em um Único arquivo PDF.",
          },
          {
            name: "ficha-tec",
            label:
              "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
          },
          {
            name: "PJ-id-doc",
            label:
              "(PJ) Documento de Identidade ou outro documento com força legal que contenha o número de R.G. e foto do(s) seu(s) representante(s) legal(is)",
          },
          {
            name: "pj-id-doc-2",
            label:
              "(PJ) CPF, caso o documento com força legal não contenha o número do CPF do(s) seu(s)representante(s) legal(is)",
          },
          {
            name: "pj-id-doc-3",
            label:
              "(PJ) Cartão do CNPJ ou Requerimento de Microempreendedor Individual; d) Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Ribeirão Preto, retroativo a junho de 2022, em nome da Instituição ou do proponente inscrito como M.E.I.",
          },
          {
            name: "pj-id-doc-4",
            label:
              "(PJ) Comprovante de endereço atual, datado a partir de julho de 2023",
          },
          {
            name: "pj-id-doc-5",
            label: "(PJ) Contrato Social ou do Estatuto e demais alterações",
          },
          {
            name: "pj-id-doc-6",
            label:
              "(PJ) Ata de eleição e posse da diretoria, quando for o caso",
          },
        ];

      case 3823:
        return [
          { name: "id-doc", label: "*Documento de identidade" },
          {
            name: "comp-end-2a",
            label:
              "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Cerquilho, retroativo a outubro de 2022",
          },
          {
            name: "cart-cnpj",
            label:
              "*Cartão do CNPJ ou Requerimento de Microempreendedor Individual",
          },
          {
            name: "comp-endereco",
            label:
              "*Comprovante de endereço há, pelo menos, 2 (dois) anos no município de São Josédo Rio Pardo",
          },
          {
            name: "comp-endereco-atual",
            label: "*Comprovante de endereço atual",
          },
          {
            name: "contr-social",
            label:
              "Contrato Social ou do Estatuto e demais alterações (Opcional)",
          },
          { name: "portf-idealizador", label: "*Portfólio do idealizador." },
          { name: "curriculo", label: "*Currículo (texto) do proponente" },
          { name: "termo-comp", label: "*Termos de Compromissos" },
          {
            name: "decDireitos",
            label:
              "*Declaração de opção de cessão de direitos autorais e/ou Declaração negativa deopção de direitos autorais",
          },
          { name: "cronograma", label: "*Cronograma de execução" },
          { name: "decResidencia", label: "Autodeclaração de Residência" },
          {
            name: "dec-coletivo",
            label:
              "Declaração de representação do Coletivo ou Grupo pelo Proponente, se tratar-se de Coletivoou Grupo",
          },
          {
            name: "dec-pessoa-com-def",
            label: "Declaração de pessoa com deficiência",
          },
          { name: "dec-etnico-racial", label: "Declaração étnico-racial" },
          { name: "outrosDocumentos", label: "Outros documentos" },
        ];

      case 3716:
        if (localStorage.getItem("tipoProponente") === "PF") {
          return [
            {
              name: "doc-photo-id-1",
              label:
                "Cópia digitalizada de um único documento com foto do proponente, constando número do CPF e RG (carteira de identidade, CNH, outros...).",
              required: true,
            },
            {
              name: "proof-address-pontal-2",
              label:
                "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Pontal, retroativo a outubro de 2022.",
              required: true,
            },
            {
              name: "proof-address-current-3",
              label:
                "Comprovante de endereço atual, datado a partir de junho de 2024.",
              required: true,
            },
            {
              name: "self-declaration-residence-4",
              label: "Autodeclaração de residência (Anexo II).",
            },
            {
              name: "curriculum-proponente",
              label: "Currículo do proponente",
              required: true,
            },
            {
              name: "curriculum-portfolio-collective",
              label: "Currículo ou portfólio de Coletivo ou idealizador",
              required: true,
            },
            {
              name: "technical-sheet-participants",
              label:
                "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
              required: true,
            },
            {
              name: "commitment-terms",
              label:
                "Termos de Compromissos assinados pelos principais integrantes do projeto (Anexo V)",
              required: true,
            },
            {
              name: "copyright-declaration",
              label:
                "Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais (Anexo III)",
              required: true,
            },
            {
              name: "execution-schedule",
              label: "Cronograma de execução",
              required: true,
            },
            {
              name: "additional-information",
              label: "Demais informações",
              required: true,
            },
            {
              name: "ethnic-declaration",
              label:
                "Quando for o caso inserir Declaração Étnico-racial (Anexo VII) e/ou Declaração de Pessoa com Deficiência (Anexo VIII)",
            },
            {
              name: "representation-declaration",
              label:
                "Declaração de representação, se for um coletivo sem CNPJ (Anexo VI)",
            },
            {
              name: "other-documents",
              label:
                "Outros documentos que o agente cultural julgar necessário para auxiliar na avaliação do mérito cultural do projeto",
            },
          ];
        } else {
          return [
            {
              name: "id-representative-1",
              label:
                "Documento de Identidade ou outro documento com força legal que contenha o número de R.G. e foto do(s) seu(s) representante(s) legal(is).",
              required: true,
            },
            {
              name: "cpf-representative-2",
              label:
                "CPF, caso o documento com força legal não contenha o número do CPF do(s) seu(s) representante(s) legal(is).",
              required: true,
            },
            {
              name: "cnpj-mei-card-3",
              label:
                "Cartão do CNPJ ou Requerimento de Microempreendedor Individual.",
              required: true,
            },
            {
              name: "address-proof-ribeirao-4",
              label:
                "Comprovante de endereço há, pelo menos, 2 (dois) anos no município de Pontal, retroativo a Dezembro de 2022, em nome da Instituição ou do proponente inscrito como M.E.I.",
              required: true,
            },
            {
              name: "current-address-proof-5",
              label:
                "Comprovante de endereço atual, datado a partir de Dezembro de 2024.",
              required: true,
            },
            {
              name: "social-contract-6",
              label: "Contrato Social ou do Estatuto e demais alterações.",
              required: true,
            },
            {
              name: "election-minutes-7",
              label: "Ata de eleição e posse da diretoria, quando for o caso.",
            },
            {
              name: "curriculum-proponente",
              label: "Currículo do proponente",
              required: true,
            },
            {
              name: "curriculum-portfolio-collective",
              label: "Currículo ou portfólio de Coletivo ou idealizador",
              required: true,
            },
            {
              name: "technical-sheet-participants",
              label:
                "Ficha técnica com a relação dos participantes, incluindo a identificação do CPF e a descrição da função no projeto.",
              required: true,
            },
            {
              name: "commitment-terms",
              label:
                "Termos de Compromissos assinados pelos principais integrantes do projeto (Anexo V)",
              required: true,
            },
            {
              name: "copyright-declaration",
              label:
                "Declaração de opção de cessão de direitos autorais e/ou Declaração negativa de opção de direitos autorais (Anexo III)",
              required: true,
            },
            {
              name: "execution-schedule",
              label: "Cronograma de execução",
              required: true,
            },
            {
              name: "ethnic-declaration",
              label:
                "Quando for o caso inserir Declaração Étnico-racial (Anexo VII) e/ou Declaração de Pessoa com Deficiência (Anexo VIII)",
            },
            {
              name: "representation-declaration",
              label:
                "Declaração de representação, se for um coletivo sem CNPJ (Anexo VI)",
            },
            {
              name: "other-documents",
              label:
                "Outros documentos que o agente cultural julgar necessário para auxiliar na avaliação do mérito cultural do projeto",
            },
          ];
        }
      default:
        return [
          {
            name: "cronograma",
            label: "*Cronograma de execução do projeto",
          },
          { name: "curriculo", label: "*Curriculo do Proponente" },
          { name: "rgCpf", label: "*RG e CPF do(a) responsável técnico(a)" },
          {
            name: "curriculoEquipe",
            label:
              "*Currículo do(a)s principais integrantes da equipe técnica e artística",
          },
          {
            name: "direitosAutorais",
            label: "*Direitos autorais e conexos",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+III+-+DECLARA%C3%87%C3%83O+DE+OP%C3%87%C3%83O+DE+CESS%C3%83O+DE+DIREITOS+AUTORAIS.docx",
          },
          {
            name: "termoCompromisso",
            label: "*Termo de compromisso dos participantes",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+V+-+MODELO+DE+TERMO+DE+COMPROMISSO+DOS+PARTICIPANTES.docx",
          },
          {
            name: "comprovanteDomicilioAtual",
            label: "*Comprovantes de domicílio ou sede atual",
          },
          {
            name: "comprovanteDomicilio2Anos",
            label: "*Comprovantes de domicílio ou sede de 02 (dois) anos",
          },
          {
            name: "curriculoPortfolio",
            label: "*Curriculo ou portfólio de coletivo ou idealizador",
          },
          {
            name: "rep-coletivo",
            label:
              "Declaração de representação do Coletivo ou Grupo pelo Proponente, se tratar-se de Coletivo ou Grupo",
          },
          {
            name: "decDeficiencia",
            label: "Declaração de pessoa com deficiência",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VIII+-+DECLARA%C3%87%C3%83O+PESSOA+COM+DEFICI%C3%8ANCIA.docx",
          },
          {
            name: "decEtnicoRacial",
            label: "Declaração étnico-racial",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VII+-+MODELO+DE+DECLARA%C3%87%C3%83O+%C3%89TNICO-RACIAL.docx",
          },
          {
            name: "decResidencia",
            label: "Autodeclaração de Residência",
            exampleLink:
              "https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+II+-+AUTODECLARA%C3%87%C3%83O+DE+RESID%C3%8ANCIA.docx",
          },
          { name: "outrosDocumentos", label: "Outros documentos" },
        ];
    }
  }

  const DocPontal = () => {
    return (
      <>
        {localStorage.getItem("tipoProponente") &&
          localStorage.getItem("tipoProponente") === "PF" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>Documentos Pessoa Física</h2>
              {pontalPF.map((item, index) => {
                return (
                  <UploadField
                    key={item.name}
                    name={item.name}
                    label={item.label}
                    exampleLink={item.exampleLink ? item.exampleLink : null}
                    exampleText="Baixar Exemplo"
                  />
                );
              })}
            </>
          )}
        {localStorage.getItem("tipoProponente") &&
          localStorage.getItem("tipoProponente") === "PJ" && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>
                Documentos Pessoa Jurídica
              </h2>
              {pontalPJ.map((item, index) => {
                return (
                  <UploadField
                    key={item.name}
                    name={item.name}
                    label={item.label}
                    exampleLink={item.exampleLink ? item.exampleLink : null}
                    exampleText="Baixar Exemplo"
                  />
                );
              })}
            </>
          )}
        <h2 style={{ marginBottom: "1rem" }}>Documentos Projeto</h2>
        {localStorage.getItem("tipoProponente") &&
          pontalProjeto.map((item, index) => {
            return (
              <UploadField
                key={item.name}
                name={item.name}
                label={item.label}
                exampleLink={item.exampleLink ? item.exampleLink : null}
                exampleText="Baixar Exemplo"
              />
            );
          })}
      </>
    );
  };

  return (
    <div>
      <PrivateRoute />
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Box
          sx={{
            width: "50%",
            border: "1px solid #ddd",
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "1rem", textAlign: "center" }}
          >
            Documentos do Projeto
          </Typography>
          <Alert sx={{ marginBottom: "20px" }} severity="warning">
            Após receber a mensagem de confirmação, o arquivo será salvo
            automaticamente e não será exibido na tela. Caso precise enviar um
            novo arquivo para substituir o anterior, repita o processo,
            preenchendo apenas o campo necessário.
          </Alert>

          {isDownloadSuccessful && (
            <Alert severity="info">Você já enviou seus documentos</Alert>
          )}

          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {storageUserDetails.idCidade === 3716 ? (
                <DocPontal />
              ) : (
                CheckRequiredDocs().map((item, index) => {
                  return (
                    <UploadField
                      key={item.name}
                      name={item.name}
                      label={item.label}
                      exampleLink={item.exampleLink ? item.exampleLink : null}
                      exampleText="Baixar Exemplo"
                    />
                  );
                })
              )}

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button variant="contained" type="submit">
                  SALVAR DOCUMENTOS
                </Button>
              </Box>
            </form>
          )}
          <FooterAlert />
        </Box>
      </Box>
    </div>
  );
};

export default DocumentUploadForm;
