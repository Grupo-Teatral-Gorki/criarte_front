import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import PrivateRoute from '../components/PrivateRoute';
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

    const UploadField = ({ name, label }) => (
        <Card sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3, maxWidth: '600px', width: '700px', margin: 'auto' }}>
            <CardContent>
                <a href='https://styxx-public.s3.sa-east-1.amazonaws.com/example-docs/ANEXO+IV+-+MODELO+DE+PLANILHA+OR%C3%87AMENT%C3%81RIA.docx'>Baixar exemplo</a>
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

    return (
        <div>
        <PrivateRoute>
            <Header />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Box sx={{ width: '50%', border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
                        Planilha Orçamentária
                    </Typography>
                    {isLoading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <Box sx={{ border: '1px solid blue', padding: '1rem', marginBottom: '2rem' }}>
                                <Typography variant="h6" color="blue">
                                    Importante!
                                </Typography>
                                <Typography variant="body1">
                                    Só é possível anexar 01 (um) arquivo por item exigido. Caso necessário, reúna todos os documentos em um único arquivo.
                                    Todos os documentos devem estar em formato PDF. O tamanho máximo para cada arquivo é de 10 MB.
                                </Typography>
                            </Box>
                            <form>
                                <div className='planilhaOrc-upload-card'>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                        <UploadField name="cronograma" />
                                    </Box>
                                </div>

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
            </PrivateRoute>
        </div>
    );
};

export default DocumentUploadForm;
