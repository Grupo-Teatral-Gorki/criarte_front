import { useRouter } from 'next/router';

const EditaisPage = () => {
    const router = useRouter();

    const handleButtonClick = async () => {
        router.push('/pnab/projeto');

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
        <div className='editais-cards'>
            <section className="voltar-pagina">
                <a href="/home" className="link-voltar">
                    <i className="bi bi-arrow-left-circle"></i>Voltar
                </a>
            </section>

            <div className="filtro_resultado">
                <section className="container_editais">
                    <button type="button">Limpar Filtros</button>
                    <form className="form-editais" aria-label="Filtro de Editais" id="editais-form">
                        <div className="form-group">
                            <label htmlFor="pesquisa">Título do edital:</label>
                            <div className="input-group">
                                <input type="text" id="pesquisa" name="pesquisa" />
                                <i className="bi bi-search" aria-hidden="true"></i>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="data-inicial">Data Inicial:</label>
                            <input type="text" id="data-inicial" name="data-inicial" className="form-control" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="data-final">Data Final:</label>
                            <input type="text" id="data-final" name="data-final" className="form-control" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="valor-projeto">Valor do Projeto:</label>
                            <input type="range" id="valor-projeto" name="valor-projeto" min="0" max="100000" step="100" />
                            <span id="valor-projeto-display">R$ 0</span>
                        </div>

                        <div className="form-group">
                            <label>Pessoa Física ou Jurídica:</label>
                            <select id="tipo-pessoa" name="tipo-pessoa" className="form-control">
                                <option value="fisica">Pessoa Física</option>
                                <option value="juridica">Pessoa Jurídica</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Inscrições:</label>
                            <select id="status-inscricao" name="status-inscricao" className="form-control">
                                <option value="abertas">Abertas</option>
                                <option value="encerradas">Encerradas</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="segmento">Segmento:</label>
                            <select id="segmento" name="segmento" className="form-control">
                                <option value="teatro">Teatro</option>
                                <option value="audiovisual">Audiovisual</option>
                                <option value="artes-plasticas-visuais-design">Artes Plásticas, Visuais E Design</option>
                                <option value="bibliotecas-arquivos-centros-culturais">Bibliotecas, Arquivos E Centros Culturais</option>
                                <option value="cinema">Cinema</option>
                                <option value="circo">Circo</option>
                                <option value="cultura-popular">Cultura Popular</option>
                                <option value="danca">Dança</option>
                                <option value="eventos-carnavalescos-escolas-samba">Eventos Carnavalescos E Escolas De Samba</option>
                                <option value="hip-hop">Hip-hop</option>
                                <option value="literatura">Literatura</option>
                                <option value="museu">Museu</option>
                                <option value="musica">Música</option>
                                <option value="opera">Ópera</option>
                                <option value="patrimonio-historico-artistico">Patrimônio Histórico E Artístico</option>
                                <option value="recuperacao-construcao-manutencao-espacos-circulacao-producao-cultural-estado">Recuperação, Construção E Manutenção De Espaços De Circulação Da Produção Cultural No Estado</option>
                                <option value="restauracao-conservacao-bens-protegidos-orgao-oficial-preservacao">Restauração E Conservação De Bens Protegidos Por Órgão Oficial De Preservação</option>
                                <option value="video">Vídeo</option>
                                <option value="projetos-especiais">Projetos Especiais</option>
                                <option value="bolsas-estudos-cursos-carater-cultural-artistico">Bolsas De Estudos Para Cursos De Caráter Cultural Ou Artístico</option>
                                <option value="pesquisa-documentacao">Pesquisa E Documentação</option>
                                <option value="plano-anual-atividades">Plano Anual De Atividades</option>
                                <option value="festivais-eventos">Festivais E Eventos</option>
                                <option value="programas-radio-televisao-finalidades-cultural-social-prestacao-servicos-comunidade">Programas De Rádio E De Televisão Com Finalidades Cultural, Social E De Prestação De Serviços À Comunidade</option>
                            </select>
                        </div>
                    </form>
                </section>

                {/* Adicionando o card na direita */}
                <section className="card-direita">
                    <img src='https://styxx-public.s3.sa-east-1.amazonaws.com/pnab-logo.png' alt="Logo PNAB" />

                    <div className="card-content">
                        <p className="desc">A Prefeitura Municipal de Brodowski torna público o Edital de Seleção Pública, em
                        atendimento à Lei Federal nº 14.399, de 08 de julho de 2022, regulamentada pelo Decreto
                        Federal nº 11.740, de 18 de outubro de 2023, observando-se suas normas legais vigentes,
                        regulamentares e pertinentes, além das condições expressas no conteúdo e anexos do
                        presente Edital.</p>
                        <button onClick={handleButtonClick} className="btn-detalhes">Acessar</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EditaisPage;
