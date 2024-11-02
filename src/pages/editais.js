import { useRouter } from 'next/router';
import PrivateRoute from '../components/PrivateRoute';
import Header from '../components/Header/Header';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const EditaisPage = () => {
    const router = useRouter();

    const handleButtonClick = async () => {
        router.push('/meusProjetos');

        const url = `https://api.grupogorki.com.br/api/projeto/listaProjetos`
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("dados recebidos", data);
        } catch (error) {
            console.error("Criando novo projeto");

            const url = `https://api.grupogorki.com.br/api/projeto/createProjeto?idEdital=2&idModalidade=1`
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Projeto criado automaticamente", response);
            } catch (error) {
                console.error("Erro ao criar projeto", error);
            }
        }
    };

    return (
        <div>
            <PrivateRoute>
                <Header></Header>
                <div className='editais-cards'>
                    <div className="edital-vigente">
                    <Button variant="outlined" sx={{maxHeight: '30px', marginRight: '10px', backgroundColor: 'white'}} href="/home">
                                Voltar
                            </Button>
                        <section className="card-direita">
                            <img src='https://styxx-public.s3.sa-east-1.amazonaws.com/pnab-logo.png' alt="Logo PNAB" />

                            <div style={{minWidth: '500px'}} className="card-content">
                                <p style={{minWidth: '500px'}} className="desc">A Prefeitura Municipal de Brodowski torna público o Edital de Seleção Pública, em
                                    atendimento à Lei Federal nº 14.399, de 08 de julho de 2022, regulamentada pelo Decreto
                                    Federal nº 11.740, de 18 de outubro de 2023, observando-se suas normas legais vigentes,
                                    regulamentares e pertinentes, além das condições expressas no conteúdo e anexos do
                                    presente Edital.</p>
                                    <Button onClick={handleButtonClick} sx={{backgroundColor: '#1D4A5D', color: 'white', minWidth: '100%'}} variant="contained">Acessar</Button>
                            </div>
                        </section>
                    </div>
                </div>
            </PrivateRoute>
        </div>
    );
};

export default EditaisPage;
