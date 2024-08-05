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
  const [dataNascimento, setDataNascimento] = useState(" ");
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSaveChanges = async () => {
    const newErrors = {};

    if (!nomeCompleto.trim()) newErrors.nomeCompleto = true;
    if (!cpf.trim()) newErrors.cpf = true;
    if (!rg.trim()) newErrors.rg = true;
    if (!dataNascimento.trim()) newErrors.dataNascimento = true;
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
          webSite: 'off@off.com',
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
        setTimeout(() => {
          setOpenSnackbar(false);
          handleClose()
          router.reload() // fecha aba
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

  const handleCpfChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 11) {
      newValue = newValue.slice(0, 11);
    }
    setCpf(newValue);
  };

  const handleRgChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 9) {
      newValue = newValue.slice(0, 9);
    }
    setRg(newValue);
  }

  const handleNumFixoChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }
    setTelefoneFixo(newValue);
  }

  const handleNumAltChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 11) {
      newValue = newValue.slice(0, 11);
    }
    setTelefoneOutro(newValue);
  }

  const getCep = async (cep) => {
    if (cep.length === 8) {
      try {
        let url = `https://viacep.com.br/ws/${cep}/json/`;
        let response = await fetch(url, {
          method: 'GET'
        });
        let data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  const handleCepChange = async (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 8) {
      newValue = newValue.slice(0, 8);
    }
    setCepResponsavel(newValue);
  
    if (newValue.length === 8) {
      let cep = await getCep(newValue)
      setLogradouroResponsavel(cep.logradouro)
      setBairroResponsavel(cep.bairro)
      setCidadeResponsavel(cep.localidade)
      setUfResponsavel(cep.uf)

    }
  }
  


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Novo proponente</DialogTitle>
      <Alert sx={{ marginBottom: '15px', marginLeft: '20px', marginRight: '20px' }} variant="filled" severity="info">Cadastre 1 proponente por login</Alert>

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
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Dados pessoais</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome completo ( Igual o seu documento de identidade )"
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
              onChange={handleCpfChange}
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
              onChange={handleRgChange}
              required
              error={errors.rg}
              helperText={errors.rg && "Este campo é obrigatório"}
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
              error={errors.dataNascimento}
              helperText={errors.dataNascimento && "Este campo é obrigatório"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Contato</Typography>
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
              label="Celular com (DDD)"
              value={celular}
              required
              error={errors.celular}
              helperText={errors.celular && "Este campo é obrigatório"}
              onChange={(e) => setCelular(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone fixo com (DDD)"
              value={telefoneFixo}
              onChange={handleNumFixoChange}
              error={errors.telefoneFixo}
              
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone alternativo com (DDD)"
              value={telefoneOutro}
              onChange={handleNumAltChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Endereço</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CEP"
              value={cepResponsavel}
              onChange={handleCepChange}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número"
              value={numeroResponsavel.trim()}
              onChange={(e) => setNumeroResponsavel(e.target.value)}
              required
              error={errors.numeroResponsavel}
              helperText={errors.numeroResponsavel && "Este campo é obrigatório"}
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
            <FormControl fullWidth required error={errors.ufResponsavel}>
              <InputLabel>UF</InputLabel>
              <Select
                value={ufResponsavel}
                onChange={(e) => setUfResponsavel(e.target.value)}
                label="UF"
              >
                <MenuItem value="MG">Minas Gerais</MenuItem>
                <MenuItem value="SP">São Paulo</MenuItem>
              </Select>
              {errors.ufResponsavel && <Typography color="error">Este campo é obrigatório</Typography>}
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
  );
};

export default NewProponentForm;
