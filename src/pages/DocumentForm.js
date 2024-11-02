  import React, { useState, useEffect } from 'react';
  import { Button, Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
  import { styled } from '@mui/system';
  import Header from '../components/Header/Header';
  import PrivateRoute from '../components/PrivateRoute';

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

      const sanitizeFileName = (fileName) => {
        return fileName
          .normalize("NFD") // Normaliza caracteres latinos com acento
          .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
          .replace(/[^a-zA-Z0-9]/g, "") // Remove caracteres especiais
          .slice(0, 20); // Limita a 20 caracteres
      };
      
      useEffect(() => {

        if (typeof window !== 'undefined') {
          const userDetails = localStorage.getItem('userDetails');
          if (userDetails) {
            setStorageUserDetails(JSON.parse(userDetails));
          }
        }
        const numeroInscricaoStored = localStorage.getItem('numeroInscricao');

        const checkDownloadStatus = async () => {
          if (numeroInscricaoStored) {
            try {
              const response = await fetch(`https://gorki-aws-acess-api.iglgxt.easypanel.host/download-zip/3798/${numeroInscricaoStored}`);
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
            const response = await fetch('https://gorki-api-nome.iglgxt.easypanel.host/api/getProjeto', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                usuario: localStorage.getItem('userEmail'),
                senha: localStorage.getItem('userPassword'),
                numeroInscricao: localStorage.getItem('numeroInscricao')
              }),
            });

            if (!response.ok) {
              throw new Error(`Erro ao buscar projeto: ${response.statusText}`);
            }

            const data = await response.json();
            setIdEdital(data.projeto.id_edital);  // Aqui coletamos o idEdital
            setIsLoading(false);
          } catch (error) {
            setError("Erro ao buscar o projeto.");
            setIsLoading(false);
          }
        };

        fetchIdEdital();

      }, []);

      const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        setFiles(prevFiles => ({
          ...prevFiles,
          [fieldName]: file
        }));
      };

      const uploadFile = async (file, fieldName) => {
        if (!numeroInscricao) {
          throw new Error('Número de inscrição do projeto não encontrado.');
        }

        const formData = new FormData();
        formData.append('IdProjeto', numeroInscricao);
        formData.append('IdTipo', 1);
        formData.append('Archive', file, sanitizeFileName(file.name)); // Usa a função sanitizeFileName

        try {
          const response = await fetch('https://api.grupogorki.com.br/api/docProjeto/Create', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: formData
          });

          if (response.ok) {
            setUploadStatus(prevStatus => ({
              ...prevStatus,
              [fieldName]: 'success',
            }));

          } else {
            setUploadStatus(prevStatus => ({
              ...prevStatus,
              [fieldName]: 'error',
            }));

            console.error('Upload error:', response.status, response.statusText, await response.text());
          }
        } catch (error) {
          setUploadStatus(prevStatus => ({
            ...prevStatus,
            [fieldName]: 'error',
          }));

          console.error('Upload error:', error.message);
        }
      };


      const handleSubmit = async (event) => {
        event.preventDefault();

        const storedUserDetails = localStorage.getItem('userDetails');
        const userDetails = JSON.parse(storedUserDetails);

        try {
          await Promise.all(Object.keys(files).map(fieldName => uploadFile(files[fieldName], fieldName)));
          setAllFilesUploaded(true);

          const updateResponse = await fetch('https://api.grupogorki.com.br/api/projeto/updateProjeto', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idProponente: userDetails.id
            })
          });

          if (!updateResponse.ok) {
            throw new Error(`Erro ao atualizar o projeto: ${updateResponse.status} ${updateResponse.statusText}`);
          }

          console.log('Projeto atualizado com sucesso:', await updateResponse.json());
        } catch (error) {
          console.error('Error updating project:', error);
        }
      };

      const UploadField = ({ name, label, exampleLink, exampleText }) => (
        <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px', margin: 'auto', mb: 2 }}>
          {exampleLink && <a href={exampleLink}>{exampleText}</a>}
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
            <UploadBox>
              <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
              {files[name] && <p>{files[name].name}</p>}
              <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF</Typography>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, name)}
                style={{ display: 'none' }}
                id={`upload-${name}`}
              />
              <label htmlFor={`upload-${name}`}>
                <Button variant="outlined" component="span">
                  SELECIONAR
                </Button>
              </label>
            </UploadBox>
            {uploadStatus[name] === 'success' && <Alert severity="success">Arquivo enviado com sucesso!</Alert>}
            {uploadStatus[name] === 'error' && <Alert severity="error">Erro ao enviar o arquivo.</Alert>}
          </CardContent>
        </Card>
      );

      const UploadBox = styled('div')(({ theme }) => ({
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#999',
        }
      }));

      const FooterAlert = () => {
        if (allFilesUploaded) {
          return <Alert severity="success">Todos os documentos foram enviados com sucesso!</Alert>;
        } else {
          return null;
        }
      };

      return (
        <div>
          <PrivateRoute />
          <Header />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Box sx={{ width: '50%', border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
                Documentos do Projeto
              </Typography>
              <Alert sx={{ marginBottom: "20px" }} severity="warning">
                Após receber a mensagem de confirmação, o arquivo será salvo automaticamente e não será exibido na tela. Caso precise enviar um novo arquivo para substituir o anterior, repita o processo, preenchendo apenas o campo necessário.
              </Alert>

              
                {isDownloadSuccessful && <Alert severity="info">Você já enviou seus documentos</Alert>}
            

              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  {storageUserDetails.idCidade === 3798 ? (
                    <>
                      <UploadField name="cronograma" label="*Cronograma de execução do projeto" />
                      <UploadField name="curriculo" label="Curriculo do proponente" />
                      <UploadField name="pessoa_com_def" label="Declaração de pessoa com deficiência" exampleLink="https://criarte.s3.us-east-2.amazonaws.com/documents/santa-rita-p4/EDITAL-04-ANEXO-7-DECLARACAO-PESSOAS-COM-DEFICIENCIA.docx" exampleText="Baixar exemplo" />
                      <UploadField name="rg-cpf" label="RG/CPF Do Proponente" />
                      <UploadField name="portfolio" label="Portfólio do idealizador ou coletivo" />
                      <UploadField name="termos-comp" label="Termos de compromisso" exampleLink="https://criarte.s3.us-east-2.amazonaws.com/documents/santa-rita-p4/EDITAL-04-ANEXO-5-TERMO-DE-COMPROMISSO-DOS-PARTICIPANTES.docx" exampleText="Baixar Exemplo" />
                      <UploadField name="comp-domicilio" label="Comprovantes de domicílio ou sede atual" />
                      <UploadField name="comp-domicilio-anos" label="Comprovantes de domicílio ou sede atual de 01 ano" />
                      <UploadField name="etnico-racial" label="Declaração Étnico Racial" exampleLink="https://criarte.s3.us-east-2.amazonaws.com/documents/santa-rita-p4/EDITAL-04-ANEXO-6-DECLARACAO-ETNICO-RACIAL.docx" exampleText="Baixar exemplo" />
                      <UploadField name="auto-residencia" label="Auto declaração de residência" />
                      <UploadField name="outros" label="Outros documentos" />
                    </>
                  ) : (
                    <>
                      <UploadField name="cronograma" label="*Cronograma de execução do projeto" />
                      <UploadField name="curriculo" label="*Curriculo do Proponente" />
                      <UploadField name="rgCpf" label="*RG e CPF do(a) responsável técnico(a)" />
                      <UploadField name="curriculoEquipe" label="*Currículo do(a)s principais integrantes da equipe técnica e artística" />
                      <UploadField name="direitosAutorais" label="*Direitos autorais e conexos" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+III+-+DECLARA%C3%87%C3%83O+DE+OP%C3%87%C3%83O+DE+CESS%C3%83O+DE+DIREITOS+AUTORAIS.docx" exampleText="Baixar exemplo" />
                      <UploadField name="termoCompromisso" label="*Termo de compromisso dos participantes" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+V+-+MODELO+DE+TERMO+DE+COMPROMISSO+DOS+PARTICIPANTES.docx" exampleText="Baixar exemplo" />
                      <UploadField name="comprovanteDomicilioAtual" label="*Comprovantes de domicílio ou sede atual" />
                      <UploadField name="comprovanteDomicilio2Anos" label="*Comprovantes de domicílio ou sede de 02 (dois) anos" />
                      <UploadField name="curriculoPortfolio" label="*Curriculo ou portfólio de coletivo ou idealizador" />
                      <UploadField name="rep-coletivo" label="Declaração de representação do Coletivo ou Grupo pelo Proponente, se tratar-se de Coletivo ou Grupo" />
                      <UploadField name="decDeficiencia" label="Declaração de pessoa com deficiência" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VIII+-+DECLARA%C3%87%C3%83O+PESSOA+COM+DEFICI%C3%8ANCIA.docx" exampleText="Baixar exemplo" />
                      <UploadField name="decEtnicoRacial" label="Declaração étnico-racial" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VII+-+MODELO+DE+DECLARA%C3%87%C3%83O+%C3%89TNICO-RACIAL.docx" exampleText="Baixar exemplo" />
                      <UploadField name="decResidencia" label="Autodeclaração de Residência" exampleLink="https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+II+-+AUTODECLARA%C3%87%C3%83O+DE+RESID%C3%8ANCIA.docx" exampleText="Baixar exemplo" />
                      <UploadField name="outrosDocumentos" label="Outros documentos" />
                    </>
                  )}

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
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
