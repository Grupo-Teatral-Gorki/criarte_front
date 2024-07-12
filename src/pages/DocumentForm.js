import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

import Header from '../components/Header/Header';
const DocumentUploadForm = () => {
  const [numeroInscricao, setNumeroInscricao] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({
    cronograma: null,
    curriculo: null,
    rgCpf: null,
    curriculoEquipe: null,
    orcamento: null,
    direitosAutorais: null,
    termoCompromisso: null,
    decEtnicoRacial: null,
    comprovanteDomicilioAtual: null,
    comprovanteDomicilio2Anos: null,
    curriculoPortfolio: null,
    declaracaoNaoSocio: null,
    outrosDocumentos: null,
  });

  useEffect(() => {
    const fetchNumeroInscricao = async () => {
      setIsLoading(true);

      const url = `https://api.grupogorki.com.br/api/projeto/listaProjetos`;
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setNumeroInscricao(data.data[0].numeroInscricao);
        } else {
          setError("Número de inscrição não encontrado.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumeroInscricao();
  }, []);

  const createProject = async () => {
    if (!numeroInscricao) {
      throw new Error('Número de inscrição do projeto não encontrado.');
    }

    const url = `https://api.grupogorki.com.br/api/docProjeto/Create`;
    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('IdProjeto', numeroInscricao);
    formData.append('IdTipo', 1); // Supondo que IdTipo seja 1 para criação de projeto

    const response = await axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'text/plain',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const onSubmit = async () => {
    if (!numeroInscricao) {
      alert('Número de inscrição do projeto não encontrado.');
      return;
    }

    try {
      await createProject();

      const formData = new FormData();
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      formData.append('IdProjeto', numeroInscricao);
      formData.append('IdTipo', 2); // Supondo que IdTipo seja 2 para envio de documentos

      const url = `https://api.grupogorki.com.br/api/docProponente/Create`;
      const token = localStorage.getItem('authToken');

      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Upload success:', response.data);
      alert('Documentos enviados com sucesso!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Arquivos enviados.');
    }
  };

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setFiles(prevFiles => ({
      ...prevFiles,
      [fieldName]: file,
    }));
  };

  const UploadField = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Cronograma de execução do projeto</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  );

  const UploadField2 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Currículo do(a) responsável técnico(a)/artístico(a)</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )
  const UploadField3 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*RG e CPF do(a) responsável técnico(a)</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField4 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Currículo do(a)s principais integrantes da equipe técnica e artística</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField5 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Direitos autorais e conexos</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField6 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Termo de compromisso dos participantes</p>
      <CardContent>
      <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+V+-+MODELO+DE+TERMO+DE+COMPROMISSO+DOS+PARTICIPANTES.docx'>Baixar exemplo</a>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField7 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Comprovantes de domicílio ou sede atual</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField8 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Comprovantes de domicílio ou sede de 02 (dois) anos</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField9 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>*Curriculo ou portfólio de coletivo ou idealizador</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField10 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>Declaração de pessoa com deficiência</p>
      <CardContent>
      <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VIII+-+DECLARA%C3%87%C3%83O+PESSOA+COM+DEFICI%C3%8ANCIA.docx'>Baixar exemplo</a>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField11 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>Declaração étnico-racial</p>
      <CardContent>
      <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+VII+-+MODELO+DE+DECLARA%C3%87%C3%83O+%C3%89TNICO-RACIAL.docx'>Baixar exemplo</a>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField12 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>Autodeclaração de Residência</p>
      <CardContent>
      <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+II+-+AUTODECLARA%C3%87%C3%83O+DE+RESID%C3%8ANCIA.docx'>Baixar exemplo</a>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

  const UploadField13 = ({ name, label }) => (
    <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '700px', width: '800px',margin: 'auto' }}>
    <p>Outros documentos</p>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>{label}</Typography>
        <UploadBox>
          <Typography variant="body2" sx={{ mb: 1 }}>Selecione o arquivo aqui</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Arquivos Suportados: PDF, TEXT, DOC, DOCX</Typography>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, name)}
            style={{ display: 'none' }}
            id={`upload-${name}`}
          />
          <label htmlFor={`upload-${name}`}>
            <Button variant="contained" component="span">
              ENVIAR
            </Button>
          </label>
        </UploadBox>
      </CardContent>
    </Card>
  )

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

  return (
      <div>
        <Header/>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>

        <Box sx={{ width: '50%', border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
            Documentos do Projeto e Proponente
          </Typography>
          {isLoading ? (
              <CircularProgress />
          ) : error ? (
              <Alert severity="error">{error}</Alert>
          ) : (
              <>
               
                <form>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField name="cronograma" /></Box>                    
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField2 name="cronograma" /></Box>                    
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField3 name="cronograma" /></Box>                    
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField4 name="cronograma" /></Box>                    
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField5 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField6 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField7 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField8 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField9 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField10 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField11 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField12 name="cronograma" /></Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><UploadField13 name="cronograma" /></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Grid item>
                      <a href='/pnab/projeto'><Button sx={{ mt: 4, mx: 2 }} variant="outlined" color="primary">Voltar</Button></a>
                    </Grid>
                    <Button
                        onClick={onSubmit}
                        variant="contained"
                        sx={{ mt: 4, mb: 2, backgroundColor: '#1976d2', color: 'white' }}
                    >
                      Enviar documentos
                    </Button>
                  </Box>
                </form>
              </>
          )}
        </Box>
      </Box>
      </div>
  );
};

export default DocumentUploadForm;
