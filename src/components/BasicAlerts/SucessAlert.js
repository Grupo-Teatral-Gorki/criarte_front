import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function SucessAlert() {
    return (
        <Stack sx={{ width: '20%' }} spacing={2}>
            <Alert severity="sucess">
                <AlertTitle>Proponente cadastrado</AlertTitle>
            </Alert>
        </Stack>
    );
}
