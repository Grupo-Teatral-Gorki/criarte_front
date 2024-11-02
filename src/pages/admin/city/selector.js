import Header from "../../../components/Header/Header";
import AdminPrivateRoute from "../../../components/AdminPrivateRoute";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const Selector = () => {
    return <div>
        <Header></Header>
        <AdminPrivateRoute></AdminPrivateRoute>
        <div className="card" style={{ marginTop: '30px', maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{display:'flex', justifyContent: 'space-between'}}>
                <Stack spacing={2} direction="row">
                <Button variant="outlined">VOLTAR</Button>
                </Stack>
                <h1>Selecione uma cidade</h1>
            </div>
        </div>
        <div className="cityList card" style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="brodowskiCard" style={{ minWidth: '20px', borderRadius: '5px', borderColor: 'gray', marginTop: '20px', padding: '10px', cursor: 'poniter' }}>
                <a><img style={{ maxWidth: '300px' }} src="https://brodowski.sp.gov.br/novo/wp-content/uploads/2021/03/logo-prefeitura2.png"></img></a>
            </div>
        </div>
    </div>;
};

export default Selector;
