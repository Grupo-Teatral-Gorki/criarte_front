import React, { useState } from "react";
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
import { FormControl, useFormControlContext } from "@mui/base/FormControl";
import { Input, inputClasses } from "@mui/base/Input";
import { styled } from "@mui/system";
import clsx from "clsx";

const PassRecovery = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Ativa o estado de carregamento

    try {
      const response = await fetch(
        "https://gorki-mail.iglgxt.easypanel.host/recover-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const responseData = await response.json();

      if (response.status !== 200) {
        setErrorMessage(
          responseData.message || "Ocorreu um erro desconhecido.",
        );
        setOpenDialog(true);
        return;
      }

      setSuccessMessage(
        "Um email com instruções para redefinir sua senha foi enviado.",
      );
      setOpenDialog(true);
    } catch (error) {
      setErrorMessage("Falha ao tentar recuperar a senha: " + error.message);
      setOpenDialog(true);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "100px",
        alignItems: "center",
        display: "flex",
      }}
      className="card"
    >
      <div className="body-recover-password">
        <div className="recover-password-container">
          <h2>Recuperar Senha</h2>
          <form style={{ marginTop: "50px" }} onSubmit={handleSubmit}>
            <FormControl defaultValue="" required>
              <Label>Email</Label>
              <StyledInput
                placeholder="Digite seu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <HelperText />
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              fullWidth
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Recuperar Senha"
              )}
            </Button>
            <Link href="/login" passHref>
              <Button
                variant="outlined"
                disabled={isLoading}
                fullWidth
                sx={{
                  marginTop: "16px",
                }}
              >
                Voltar ao Login
              </Button>
            </Link>
          </form>
        </div>
        <Footer />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{successMessage ? "Sucesso" : "Erro"}</DialogTitle>
          <DialogContent>
            <Alert severity={successMessage ? "success" : "error"}>
              {successMessage || errorMessage}
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color={successMessage ? "success" : "error"}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PassRecovery;

const StyledInput = styled(Input)(
  ({ theme }) => `

  .${inputClasses.input} {
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
    }
  }
`,
);

const Label = styled(({ children, className }) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return <p>{children}</p>;
  }

  const { error, required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return (
    <p className={clsx(className, error || showRequiredError ? "invalid" : "")}>
      {children}
      {required ? " *" : ""}
    </p>
  );
})`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 0.875rem;
  margin-bottom: 4px;

  &.invalid {
    color: red;
  }
`;

const HelperText = styled((props) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return null;
  }

  const { required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return showRequiredError ? <p {...props}>Este campo é obrigatório.</p> : null;
})`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 0.875rem;
`;

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
