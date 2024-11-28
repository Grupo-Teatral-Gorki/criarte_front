export const fetchProjectInfo = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://api.grupogorki.com.br/api/projeto/listaProjetos`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
    } else {
    }
  } catch (error) {
    console.error("Erro ao carregar projetos.");
  }
};
