import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from 'next/router';

const NewProponentForm = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [telefoneFixo, setTelefoneFixo] = useState("");
  const [telefoneOutro, setTelefoneOutro] = useState("");
  const [webSite, setWebSite] = useState("");
  const [cepResponsavel, setCepResponsavel] = useState("");
  const [logradouroResponsavel, setLogradouroResponsavel] = useState("");
  const [numeroResponsavel, setNumeroResponsavel] = useState("");
  const [complementoResponsavel, setComplementoResponsavel] = useState("");
  const [bairroResponsavel, setBairroResponsavel] = useState("");
  const [cidadeResponsavel, setCidadeResponsavel] = useState("");
  const [ufResponsavel, setUfResponsavel] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [tipoCadastro, setTipoCadastro] = useState("PF"); // Novo estado para controlar o tipo de cadastro
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleTipoCadastroChange = (e) => {
    setTipoCadastro(e.target.value);
  };

  const handleSaveChanges = async () => {
    const newErrors = {};

    // Validação para Pessoa Física
    if (tipoCadastro === "PF") {
      if (!nomeCompleto.trim()) newErrors.nomeCompleto = true;
      if (!cpf.trim()) newErrors.cpf = true;
      if (!rg.trim()) newErrors.rg = true;
      if (!dataNascimento.trim()) newErrors.dataNascimento = true;
    } 
    // Validação para Pessoa Jurídica ou Cooperativa
    else {
      if (!razaoSocial.trim()) newErrors.razaoSocial = true;
      if (!cnpj.trim()) newErrors.cnpj = true;
      if (!nomeFantasia.trim()) newErrors.nomeFantasia = true;
    }

    if (!email.trim()) newErrors.email = true;
    if (!celular.trim()) newErrors.celular = true;
    if (!cepResponsavel.trim()) newErrors.cepResponsavel = true;
    if (!logradouroResponsavel.trim()) newErrors.logradouroResponsavel = true;
    if (!numeroResponsavel.trim()) newErrors.numeroResponsavel = true;
    if (!bairroResponsavel.trim()) newErrors.bairroResponsavel = true;
    if (!cidadeResponsavel.trim()) newErrors.cidadeResponsavel = true;
    if (!ufResponsavel.trim()) newErrors.ufResponsavel = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSnackbarSeverity('error');
      setSnackbarMessage('Por favor, preencha todos os campos obrigatórios.');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    const url = `https://api.grupogorki.com.br/api/proponentes/createProponente`;
    const token = localStorage.getItem('authToken');

    try {
      const body = tipoCadastro === "PF" 
        ? {
          nomeCompleto, cpf, rg, nomeSocial, dataNascimento, email, celular, telefoneFixo, telefoneOutro,
          cepResponsavel, logradouroResponsavel, numeroResponsavel, complementoResponsavel, bairroResponsavel, cidadeResponsavel, ufResponsavel
        }
        : {
          razaoSocial, cnpj, nomeFantasia, webSite, email, celular, telefoneFixo, telefoneOutro,
          cepResponsavel, logradouroResponsavel, numeroResponsavel, complementoResponsavel, bairroResponsavel, cidadeResponsavel, ufResponsavel
        };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Proponente cadastrado com sucesso!');
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          handleClose();
          router.reload(); // Fecha aba
        }, 2000);
      }

      const data = await response.json();
      console.log("Proponente salvo com sucesso:", data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Novo proponente</DialogTitle>
      <Alert sx={{ marginBottom: '15px', marginLeft: '20px', marginRight: '20px' }} variant="filled" severity="info">
        Cadastre 1 proponente por login
      </Alert>

      <DialogContent>
        <RadioGroup row value={tipoCadastro} onChange={handleTipoCadastroChange} name="proponentType">
          <FormControlLabel value="PF" control={<Radio />} label="Pessoa Física" />
          <FormControlLabel value="PJ" control={<Radio />} label="Pessoa Jurídica" />
          <FormControlLabel value="Cooperativa" control={<Radio />} label="Cooperativa" />
        </RadioGroup>
        <Snackbar open={openSnackbar} autoHideDuration={2000}>
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>

        <Grid container spacing={2}>
          {/* Exibe campos para Pessoa Física */}
          {tipoCadastro === "PF" && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" mt={3} mb={1}>Dados pessoais</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  required
                  error={errors.nomeCompleto}
                  helperText={errors.nomeCompleto && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  error={errors.cpf}
                  helperText={errors.cpf && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  required
                  error={errors.rg}
                  helperText={errors.rg && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                  error={errors.dataNascimento}
                  helperText={errors.dataNascimento && "Este campo é obrigatório"}
                />
              </Grid>
            </>
          )}

          {/* Exibe campos para Pessoa Jurídica ou Cooperativa */}
          {tipoCadastro !== "PF" && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" mt={3} mb={1}>Dados da empresa</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Razão Social"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  required
                  error={errors.razaoSocial}
                  helperText={errors.razaoSocial && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                  error={errors.cnpj}
                  helperText={errors.cnpj && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  required
                  error={errors.nomeFantasia}
                  helperText={errors.nomeFantasia && "Este campo é obrigatório"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WebSite"
                  value={webSite}
                  onChange={(e) => setWebSite(e.target.value)}
                />
              </Grid>
            </>
          )}

          {/* Campos comuns para ambos os tipos */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Informações de contato</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={errors.email}
              helperText={errors.email && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
              error={errors.celular}
              helperText={errors.celular && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone fixo"
              value={telefoneFixo}
              onChange={(e) => setTelefoneFixo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Outro telefone"
              value={telefoneOutro}
              onChange={(e) => setTelefoneOutro(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Endereço do responsável</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CEP"
              value={cepResponsavel}
              onChange={(e) => setCepResponsavel(e.target.value)}
              required
              error={errors.cepResponsavel}
              helperText={errors.cepResponsavel && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Logradouro"
              value={logradouroResponsavel}
              onChange={(e) => setLogradouroResponsavel(e.target.value)}
              required
              error={errors.logradouroResponsavel}
              helperText={errors.logradouroResponsavel && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Número"
              value={numeroResponsavel}
              onChange={(e) => setNumeroResponsavel(e.target.value)}
              required
              error={errors.numeroResponsavel}
              helperText={errors.numeroResponsavel && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Complemento"
              value={complementoResponsavel}
              onChange={(e) => setComplementoResponsavel(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bairro"
              value={bairroResponsavel}
              onChange={(e) => setBairroResponsavel(e.target.value)}
              required
              error={errors.bairroResponsavel}
              helperText={errors.bairroResponsavel && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cidade"
              value={cidadeResponsavel}
              onChange={(e) => setCidadeResponsavel(e.target.value)}
              required
              error={errors.cidadeResponsavel}
              helperText={errors.cidadeResponsavel && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>UF</InputLabel>
              <Select
                label="UF"
                value={ufResponsavel}
                onChange={(e) => setUfResponsavel(e.target.value)}
                required
                error={errors.ufResponsavel}
              >
                <MenuItem value="AC">Acre</MenuItem>
                <MenuItem value="AL">Alagoas</MenuItem>
                <MenuItem value="AP">Amapá</MenuItem>
                <MenuItem value="AM">Amazonas</MenuItem>
                <MenuItem value="BA">Bahia</MenuItem>
                <MenuItem value="CE">Ceará</MenuItem>
                <MenuItem value="DF">Distrito Federal</MenuItem>
                <MenuItem value="ES">Espírito Santo</MenuItem>
                <MenuItem value="GO">Goiás</MenuItem>
                <MenuItem value="MA">Maranhão</MenuItem>
                <MenuItem value="MT">Mato Grosso</MenuItem>
                <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                <MenuItem value="MG">Minas Gerais</MenuItem>
                <MenuItem value="PA">Pará</MenuItem>
                <MenuItem value="PB">Paraíba</MenuItem>
                <MenuItem value="PR">Paraná</MenuItem>
                <MenuItem value="PE">Pernambuco</MenuItem>
                <MenuItem value="PI">Piauí</MenuItem>
                <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                <MenuItem value="RO">Rondônia</MenuItem>
                <MenuItem value="RR">Roraima</MenuItem>
                <MenuItem value="SC">Santa Catarina</MenuItem>
                <MenuItem value="SP">São Paulo</MenuItem>
                <MenuItem value="SE">Sergipe</MenuItem>
                <MenuItem value="TO">Tocantins</MenuItem>
              </Select>
              {errors.ufResponsavel && (
                <Typography variant="caption" color="error">
                  Este campo é obrigatório
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSaveChanges} color="primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProponentForm;
