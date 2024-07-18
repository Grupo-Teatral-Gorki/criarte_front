import React, { useState } from "react";

//import "../Proponente.css";
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
} from "@mui/material";
import { Snackbar, Alert } from '@mui/material';


const NewProponentForm = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState(" ");
  const [cpf, setCpf] = useState(" ");
  const [rg, setRg] = useState(" ");
  const [nomeSocial, setNomeSocial] = useState(" ");
  const [dataNascimento, setDataNascimento] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [celular, setCelular] = useState(" ");
  const [telefoneFixo, setTelefoneFixo] = useState(" ");
  const [telefoneOutro, setTelefoneOutro] = useState(" ");
  const [webSite, setWebSite] = useState(" ");
  const [cepResponsavel, setCepResponsavel] = useState(" ");
  const [logradouroResponsavel, setLogradouroResponsavel] = useState(" ");
  const [numeroResponsavel, setNumeroResponsavel] = useState(" ");
  const [complementoResponsavel, setComplementoResponsavel] = useState(" ");
  const [bairroResponsavel, setBairroResponsavel] = useState(" ");
  const [cidadeResponsavel, setCidadeResponsavel] = useState(" ");
  const [ufResponsavel, setUfResponsavel] = useState(" ");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSaveChanges = async () => {
    setLoading(true);
    const url = `https://api.grupogorki.com.br/api/proponentes/createProponente`;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razaoSocial: "off",
          cnpj: "off",
          nomeFantasia: "off",
          webSite: webSite,
          email: email,
          celular: celular,
          telefoneFixo: telefoneFixo,
          telefoneOutro: telefoneOutro,
          responsavelLegal: nomeCompleto,
          cpfResponsavel: cpf,
          rgResponsavel: rg,
          nomeSocial: nomeSocial,
          dataNascimento: dataNascimento,
          cargo: "off",
          cepResponsavel: cepResponsavel,
          logradouroResponsavel: logradouroResponsavel,
          numeroResponsavel: numeroResponsavel,
          complementoResponsavel: complementoResponsavel,
          bairroResponsavel: bairroResponsavel,
          cidadeResponsavel: cidadeResponsavel,
          ufResponsavel: ufResponsavel,
          ceppj: "off",
          logradouroPJ: "off",
          numeroPJ: 123,
          complementoPJ: "off",
          bairroPJ: "desabilitado",
          cidadePJ: "off",
          ufpj: "of",
        }),
      });

      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Proponente cadastrado com sucesso!');
        setOpenSnackbar(true);
        setTimeout(() => setOpenSnackbar(false), 5000);
      } 
      

      const data = await response.json();
      console.log("Proponente salvo com sucesso:", data);
      alert("Proponente salvo com sucesso!");

      //setRazaoSocial("");
      //setCnpj("");
      //setNomeFantasia("");
      setWebSite("");
      setEmail("");
      setCelular("");
      setTelefoneFixo("");
      setTelefoneOutro("");
      setNomeCompleto("");
      setCpf("");
      setRg("");
      setNomeSocial("");
      setDataNascimento("");
      //setCargo("");
      setCepResponsavel("");
      setLogradouroResponsavel("");
      setNumeroResponsavel("");
      setComplementoResponsavel("");
      setBairroResponsavel("");
      setCidadeResponsavel("");
      setUfResponsavel("");
      //setCepPJ("");
      //setLogradouroPJ("");
      //setNumeroPJ("");
      //setComplementoPJ("");
      //setBairroPJ("");
      //setCidadePJ("");
      //setUfPJ("");

      handleClose();
    } catch (error) {
      console.log(error)
        } finally {
      setLoading(false);
    }
  };

  return (
      <div>
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
    
      <DialogTitle>Novo proponente</DialogTitle>
      <Alert sx={{marginBottom: '15px', marginLeft: '20px', marginRight: '20px'}} severity="error">Cadastre 1 proponente por login</Alert>

      <DialogContent>
        <RadioGroup row defaultValue="Pessoa Jurídica" name="proponentType">
          <FormControlLabel value="Pessoa Física" checked={true} control={<Radio />} label="Pessoa Física" />
          <FormControlLabel value="Pessoa Física" checked={false} disabled={true} control={<Radio />} label="Pessoa Jurídica" />
          <FormControlLabel value="Cooperativa" checked={false} disabled={true} control={<Radio />} label="Cooperativa" />

        </RadioGroup>
        <Snackbar open={openSnackbar} autoHideDuration={2000}>
      <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
    </Snackbar>
        <Grid container spacing={2}>
          {/* Dados pessoais */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>
              Dados pessoais
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome completo ( Igual o seu documento de identidade )"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="RG"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome social"
              value={nomeSocial}
              onChange={(e) => setNomeSocial(e.target.value)}
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
            />
          </Grid>

          {/* Contato */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>
              Contato
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Celular com (DDD)"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
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
              label="Telefone alternativo"
              value={telefoneOutro}
              onChange={(e) => setTelefoneOutro(e.target.value)}
            />
          </Grid>
          {/* Endereço Responsável */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>
              Endereço
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CEP"
              value={cepResponsavel}
              onChange={(e) => setCepResponsavel(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Logradouro"
              value={logradouroResponsavel}
              onChange={(e) => setLogradouroResponsavel(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número"
              value={numeroResponsavel}
              onChange={(e) => setNumeroResponsavel(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cidade"
              value={cidadeResponsavel}
              onChange={(e) => setCidadeResponsavel(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>UF</InputLabel>
              <Select
                value={ufResponsavel}
                onChange={(e) => setUfResponsavel(e.target.value)}
                label="UF"
              >
                <MenuItem value="MG">Minas Gerais</MenuItem>
                <MenuItem value="SP">São Paulo</MenuItem>

              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSaveChanges} disabled={loading} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
      </div>
  );
};

export default NewProponentForm;
