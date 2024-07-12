import React from 'react';
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
  FormControl
} from '@mui/material';

const NovoProponentForm = ({ open, handleClose }) => {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Novo proponente</DialogTitle>
        <DialogContent>
          <RadioGroup row defaultValue="Pessoa Jurídica" name="proponentType">
            <FormControlLabel value="Pessoa Física" control={<Radio />} label="Pessoa Física" />
            <FormControlLabel value="Pessoa Jurídica" control={<Radio />} label="Pessoa Jurídica" />
            <FormControlLabel value="Cooperativa" control={<Radio />} label="Cooperativa" />
          </RadioGroup>
        <Grid container spacing={2}>
          {/* Dados pessoais */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Dados pessoais</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Nome completo (como está no documento de identidade)" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="CPF" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="RG" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Nome social" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label=" " type="date" required />
          </Grid>

          {/* Contato */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Contato</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="E-mail" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Celular com (DDD)" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Telefone fixo" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Telefone alternativo" />
          </Grid>

          {/* Endereço */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Endereço</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="CEP" />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField fullWidth label="Logradouro" />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Número" />
          </Grid>
          <Grid item xs={12} md={10}>
            <TextField fullWidth label="Complemento" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Bairro" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Município" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="UF" />
          </Grid>

          {/* Perfil do Proponente */}
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Perfil do Proponente</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gênero</InputLabel>
              <Select>
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Origem Étnica</InputLabel>
              <Select>
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Branco">Branco</MenuItem>
                <MenuItem value="Negro">Negro</MenuItem>
                <MenuItem value="Pardo">Pardo</MenuItem>
                <MenuItem value="Indígena">Indígena</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado Civil</InputLabel>
              <Select>
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Solteiro">Solteiro</MenuItem>
                <MenuItem value="Casado">Casado</MenuItem>
                <MenuItem value="Divorciado">Divorciado</MenuItem>
                <MenuItem value="Viúvo">Viúvo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Possui alguma deficiência?</InputLabel>
              <Select>
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Perfil Demográfico e Formação</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="monthly-income">Renda Familiar Mensal</InputLabel>
              <Select
                labelId="monthly-income"
                id="monthly-income"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Até 1 salário mínimo">Até 1 salário mínimo</MenuItem>
                <MenuItem value="De 1 a 3 salários mínimos">De 1 a 3 salários mínimos</MenuItem>
                <MenuItem value="Mais de 3 salários mínimos">Mais de 3 salários mínimos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="education-level">Nível de Escolaridade</InputLabel>
              <Select
                labelId="education-level"
                id="education-level"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
                <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
                <MenuItem value="Ensino Superior">Ensino Superior</MenuItem>
                <MenuItem value="Pós-graduação">Pós-graduação</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Área de Formação" />
          </Grid>
        {/* Experiência e Participação Cultural */}
        <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Experiência e Participação Cultural</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="years-experience">Anos de Experiência na Área Cultural</InputLabel>
              <Select
                labelId="years-experience"
                id="years-experience"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Menos de 1 ano">Menos de 1 ano</MenuItem>
                <MenuItem value="1 a 3 anos">1 a 3 anos</MenuItem>
                <MenuItem value="Mais de 3 anos">Mais de 3 anos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="cultural-incentives">Já Recebeu Outros Incentivos Culturais ou Bolsas?</InputLabel>
              <Select
                labelId="cultural-incentives"
                id="cultural-incentives"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="autonomous-activities">No último ano desenvolveu Atividades Culturais de Forma Autônoma ou como Empregado?</InputLabel>
              <Select
                labelId="autonomous-activities"
                id="autonomous-activities"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Principal Área de Atuação Cultural" />
          </Grid>
           {/* Aspectos Financeiros */}
           <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Aspectos Financeiros</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="annual-income">Renda Anual Relacionada à Atividade Cultural</InputLabel>
              <Select
                labelId="annual-income"
                id="annual-income"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Menos de R$ 10.000">Menos de R$ 10.000</MenuItem>
                <MenuItem value="R$ 10.000 - R$ 30.000">R$ 10.000 - R$ 30.000</MenuItem>
                <MenuItem value="Mais de R$ 30.000">Mais de R$ 30.000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="financial-dependence">Dependência Financeira da Atividade Cultural</InputLabel>
              <Select
                labelId="financial-dependence"
                id="financial-dependence"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Totalmente dependente">Totalmente dependente</MenuItem>
                <MenuItem value="Parcialmente dependente">Parcialmente dependente</MenuItem>
                <MenuItem value="Não dependente">Não dependente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
           {/* Objetivos e Motivações */}
           <Grid item xs={12}>
            <Typography variant="h6" mt={3} mb={1}>Objetivos e Motivações</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="main-goal">Principal Objetivo ao Participar dos Programas</InputLabel>
              <Select
                labelId="main-goal"
                id="main-goal"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Desenvolvimento pessoal">Desenvolvimento pessoal</MenuItem>
                <MenuItem value="Contribuição cultural">Contribuição cultural</MenuItem>
                <MenuItem value="Networking">Networking</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="contribution">Como Pretende Contribuir para o Enriquecimento Cultural</InputLabel>
              <Select
                labelId="contribution"
                id="contribution"
                defaultValue=""
                fullWidth
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                <MenuItem value="Promovendo diversidade cultural">Promovendo diversidade cultural</MenuItem>
                <MenuItem value="Educando através da cultura">Educando através da cultura</MenuItem>
                <MenuItem value="Incentivando novos talentos">Incentivando novos talentos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Participação em Grupos ou Movimentos Culturais" />
          </Grid>
          <Grid item xs={12}></Grid>
          {/* Outros campos conforme especificações */}

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancelar</Button>
        <Button onClick={handleClose} color="primary" variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NovoProponentForm;
