import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Footer from "../../components/Footer/Footer";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os termos
    const hasAcceptedTerms = localStorage.getItem("hasAcceptedTerms");
    if (!hasAcceptedTerms) {
      setOpenDialog(true);
    }

    const fetchIpInfo = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpInfo(data);
      } catch (error) {
        console.error("Erro ao obter informações de IP:", error);
      }
    };

    fetchIpInfo();
  }, []);

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const vendor = navigator.vendor;
    const language = navigator.language;
    const deviceMemory = navigator.deviceMemory || "unknown";
    const hardwareConcurrency = navigator.hardwareConcurrency || "unknown";
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    return {
      userAgent,
      platform,
      vendor,
      language,
      deviceMemory,
      hardwareConcurrency,
      screenWidth,
      screenHeight,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Ativa o estado de carregamento

    const deviceInfo = getDeviceInfo();
    const fullInfo = {
      ...deviceInfo,
      ip: ipInfo?.ip || "IP not available",
    };
    console.log("Device Info:", JSON.stringify(fullInfo));

    try {
      const response = await fetch(
        "https://api.grupogorki.com.br/api/usuarios/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuario: email, senha: password }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const data = await response.json();
      const userDetails = {
        id: data.user.data.id,
        usuario: data.user.data.usuario,
        idCidade: data.user.data.idCidade,
        tipoUsuario: data.user.data.tipoUsuario,
      };

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      login(data.token, userDetails);
      router.push("/home");
    } catch (error) {
      console.error("Erro na autenticação:", error.message);
      alert("Falha na autenticação: " + error.message);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  const handleDialogClose = (accept) => {
    if (accept) {
      localStorage.setItem("hasAcceptedTerms", "true");
      setOpenDialog(false);
    } else {
      router.push("/"); // Redireciona para a página inicial, por exemplo
    }
  };

  return (
    <div className="body-login">
      <img
        className="logo-login"
        src="https://styxx-public.s3.sa-east-1.amazonaws.com/logo_criarte_black.png"
        alt="Logo Criarte"
      />
      <div className="login-container">
        <div
          style={{
            backgroundColor: "#ffcc00",
            color: "#000",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          ⚠️ Nosso sistema passará por manutenção no domingo, 25 de fevereiro de
          2024, a partir das 20h, e retornará na segunda-feira, 26 de fevereiro
          de 2024, às 5h. O sistema ficará indisponível. Pedimos desculpas pelo
          transtorno.
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            variant="outlined"
            onClick={() => router.push("/register")}
            disabled={isLoading}
            sx={{ marginRight: "8px" }}
          >
            Cadastrar
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            fullWidth
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
          <a
            href="/pass/recovery"
            style={{
              marginTop: "30px",
              cursor: "pointer",
              color: "GRAY",
              fontSize: ".8em",
            }}
          >
            Recuperar Senha
          </a>
        </form>
      </div>
      <Footer></Footer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Aceitação de Termos</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Ao aceitar, você concorda que o Criarte e suas empresas parceiras,
            assim como outras organizações que colaboram para o funcionamento da
            plataforma, possam gerenciar e acessar todos os dados inseridos
            sempre que necessário.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose(true)}
            color="success"
            sx={{ marginLeft: "auto" }}
          >
            Aceitar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
