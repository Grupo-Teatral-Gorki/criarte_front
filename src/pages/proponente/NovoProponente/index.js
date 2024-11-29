import React, { useState, useEffect } from "react";
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
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/router";

const NovoProponente = ({ open, handleClose }) => {
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
  const [enablePj, setEnablePj] = useState(false);

  // Adicionados para Pessoa Jurídica
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");

  const [proponentType, setProponentType] = useState("Pessoa Física"); // Para controle do tipo de proponente
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails && userDetails.idCidade === 3842) {
      setEnablePj(true);
    } else {
      setEnablePj(false);
    }
  }, []);

  const handleSaveChanges = async () => {
    const newErrors = {};

    // Validações de campos para Pessoa Física
    if (proponentType === "Pessoa Física") {
      if (!nomeCompleto.trim()) newErrors.nomeCompleto = true;
      if (!cpf.trim()) newErrors.cpf = true;
      if (!rg.trim()) newErrors.rg = true;
      if (!dataNascimento.trim()) newErrors.dataNascimento = true;
    } else {
      // Validações de campos para Pessoa Jurídica
      if (!razaoSocial.trim()) newErrors.razaoSocial = true;
      if (!cnpj.trim()) newErrors.cnpj = true;
      if (!nomeFantasia.trim()) newErrors.nomeFantasia = true;
    }

    // Campos comuns
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
      setSnackbarSeverity("error");
      setSnackbarMessage("Por favor, preencha todos os campos obrigatórios.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    const url = `https://gorki-fix-proponente.iglgxt.easypanel.host/api/cadastrarProponente`;
    const token = localStorage.getItem("authToken");
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razaoSocial:
            proponentType === "Pessoa Jurídica" ? razaoSocial || null : null,
          cnpj: proponentType === "Pessoa Jurídica" ? cnpj || null : null,
          nomeFantasia:
            proponentType === "Pessoa Jurídica" ? nomeFantasia || null : null,
          webSite: webSite || "off@off.com", // Valor padrão se não preenchido
          email: email || "off@off.com", // Valor padrão se não preenchido
          celular: celular || null, // Valor padrão se não preenchido
          telefoneFixo: telefoneFixo || null, // Valor padrão se não preenchido
          telefoneOutro: telefoneOutro || null, // Valor padrão se não preenchido
          responsavelLegal: nomeCompleto || null, // Valor padrão se não preenchido
          cpfResponsavel: cpf || null, // Valor padrão se não preenchido
          rgResponsavel: rg || null, // Valor padrão se não preenchido
          nomeSocial: nomeSocial || null, // Valor padrão se não preenchido
          dataNascimento: dataNascimento || null, // Valor padrão se não preenchido
          cargo: null, // Valor fixo
          cepResponsavel: cepResponsavel || null, // Valor padrão se não preenchido
          logradouroResponsavel: logradouroResponsavel || null, // Valor padrão se não preenchido
          numeroResponsavel: Number(numeroResponsavel) || 123, // Valor padrão se não preenchido, assegurando que é um número
          complementoResponsavel: complementoResponsavel || null, // Valor padrão se não preenchido
          bairroResponsavel: bairroResponsavel || null, // Valor padrão se não preenchido
          cidadeResponsavel: cidadeResponsavel || null, // Valor padrão se não preenchido
          ufResponsavel: ufResponsavel || null, // Valor padrão se não preenchido
          ceppj: null, // Valor fixo
          logradouroPJ: null, // Valor fixo
          numeroPJ: 123, // Valor fixo
          complementoPJ: null, // Valor fixo
          bairroPJ: "desabilitado", // Valor fixo
          cidadePJ: null, // Valor fixo
          ufpj: "of", // Valor fixo
          idUsuarioCadastro: userDetails.id,
        }),
      });

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Proponente cadastrado com sucesso!");
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          handleClose();
          router.reload(); // fecha aba
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
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 11) {
      newValue = newValue.slice(0, 11);
    }
    setCpf(newValue);
  };

  const handleRgChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 9) {
      newValue = newValue.slice(0, 9);
    }
    setRg(newValue);
  };

  const handleCnpjChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 14) {
      newValue = newValue.slice(0, 14);
    }
    setCnpj(newValue);
  };

  const handleNumFixoChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }
    setTelefoneFixo(newValue);
  };

  const handleNumAltChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 11) {
      newValue = newValue.slice(0, 11);
    }
    setTelefoneOutro(newValue);
  };

  const getCep = async (cep) => {
    if (cep.length === 8) {
      try {
        let url = `https://viacep.com.br/ws/${cep}/json/`;
        let response = await fetch(url, {
          method: "GET",
        });
        let data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCepChange = async (e) => {
    let newValue = e.target.value.replace(/[^0-9]/g, "");
    if (newValue.length > 8) {
      newValue = newValue.slice(0, 8);
    }
    setCepResponsavel(newValue);

    if (newValue.length === 8) {
      let cep = await getCep(newValue);
      setLogradouroResponsavel(cep.logradouro);
      setBairroResponsavel(cep.bairro);
      setCidadeResponsavel(cep.localidade);
      setUfResponsavel(cep.uf);
    }
  };

  console.log(enablePj);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Novo proponente</DialogTitle>
      <Alert
        sx={{ marginBottom: "15px", marginLeft: "20px", marginRight: "20px" }}
        variant="filled"
        severity="info"
      >
        Cadastre 1 proponente por login
      </Alert>

      <DialogContent>
        <RadioGroup
          row
          value={proponentType}
          onChange={(e) => {
            setProponentType(e.target.value);
            // Limpar campos ao trocar tipo
            setNomeCompleto("");
            setCpf("");
            setRg("");
            setNomeSocial("");
            setDataNascimento("");
            setRazaoSocial("");
            setCnpj("");
            setNomeFantasia("");
          }}
        >
          <FormControlLabel
            value="Pessoa Física"
            control={<Radio />}
            label="Pessoa Física"
          />
          <FormControlLabel
            value="Pessoa Jurídica"
            control={<Radio />}
            disabled={enablePj}
            label="Pessoa Jurídica"
          />
        </RadioGroup>

        {proponentType === "Pessoa Física" && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  variant="outlined"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  error={!!errors.nomeCompleto}
                  helperText={errors.nomeCompleto ? "Campo obrigatório." : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  variant="outlined"
                  value={cpf}
                  onChange={handleCpfChange}
                  error={!!errors.cpf}
                  helperText={errors.cpf ? "Campo obrigatório." : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="RG"
                  variant="outlined"
                  value={rg}
                  onChange={handleRgChange}
                  error={!!errors.rg}
                  helperText={errors.rg ? "Campo obrigatório." : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Social"
                  variant="outlined"
                  value={nomeSocial}
                  onChange={(e) => setNomeSocial(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  error={!!errors.dataNascimento}
                  helperText={errors.dataNascimento ? "Campo obrigatório." : ""}
                />
              </Grid>
            </Grid>
          </>
        )}

        {proponentType === "Pessoa Jurídica" && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Razão Social"
                  variant="outlined"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  error={!!errors.razaoSocial}
                  helperText={errors.razaoSocial ? "Campo obrigatório." : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  variant="outlined"
                  value={cnpj}
                  onChange={handleCnpjChange}
                  error={!!errors.cnpj}
                  helperText={errors.cnpj ? "Campo obrigatório." : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  variant="outlined"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  error={!!errors.nomeFantasia}
                  helperText={errors.nomeFantasia ? "Campo obrigatório." : ""}
                />
              </Grid>
            </Grid>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Celular"
              variant="outlined"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              error={!!errors.celular}
              helperText={errors.celular ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone Fixo"
              variant="outlined"
              value={telefoneFixo}
              onChange={handleNumFixoChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone Outro"
              variant="outlined"
              value={telefoneOutro}
              onChange={handleNumAltChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              variant="outlined"
              value={webSite}
              onChange={(e) => setWebSite(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CEP"
              variant="outlined"
              value={cepResponsavel}
              onChange={handleCepChange}
              error={!!errors.cepResponsavel}
              helperText={errors.cepResponsavel ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Logradouro"
              variant="outlined"
              value={logradouroResponsavel}
              onChange={(e) => setLogradouroResponsavel(e.target.value)}
              error={!!errors.logradouroResponsavel}
              helperText={
                errors.logradouroResponsavel ? "Campo obrigatório." : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número"
              variant="outlined"
              value={numeroResponsavel}
              onChange={(e) => setNumeroResponsavel(e.target.value)}
              error={!!errors.numeroResponsavel}
              helperText={errors.numeroResponsavel ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Complemento"
              variant="outlined"
              value={complementoResponsavel}
              onChange={(e) => setComplementoResponsavel(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bairro"
              variant="outlined"
              value={bairroResponsavel}
              onChange={(e) => setBairroResponsavel(e.target.value)}
              error={!!errors.bairroResponsavel}
              helperText={errors.bairroResponsavel ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cidade"
              variant="outlined"
              value={cidadeResponsavel}
              onChange={(e) => setCidadeResponsavel(e.target.value)}
              error={!!errors.cidadeResponsavel}
              helperText={errors.cidadeResponsavel ? "Campo obrigatório." : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="UF"
              variant="outlined"
              value={ufResponsavel}
              onChange={(e) => setUfResponsavel(e.target.value)}
              error={!!errors.ufResponsavel}
              helperText={errors.ufResponsavel ? "Campo obrigatório." : ""}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSaveChanges} color="primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default NovoProponente;
