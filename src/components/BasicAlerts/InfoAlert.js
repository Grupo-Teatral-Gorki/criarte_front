import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function InfoAlert() {
  return (
    <Stack sx={{ width: "20%" }} spacing={2}>
      <Alert severity="info">
        <AlertTitle>Atualização em andamento...</AlertTitle>A plataforma está
        sendo atualizada, o que pode gerar instabilidade.
      </Alert>
    </Stack>
  );
}
