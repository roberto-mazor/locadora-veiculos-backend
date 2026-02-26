
function fnMontarCardVeiculo(veiculo) {

    console.log(`Carregando veículo: ${veiculo.modelo}`);
}

function fnCarregarVeiculos() {
    fetch('http://localhost:3000/veiculos', { method: 'GET' }) 
        .then(response => response.json()) 
        .then((veiculos) => {
            veiculos.forEach(veiculo => {
                fnMontarCardVeiculo(veiculo); 
            });
        })
        .catch(erro => console.log("Erro ao carregar veículos: " + erro.message));
}

fnCarregarVeiculos();

function fnLimparCampos() {
    document.getElementById("nome_cliente").value = "";
    document.getElementById("email_cliente").value = "";
    document.getElementById("categoria_veiculo").selectedIndex = 0;
}

const btn_reservar = document.getElementById("btn_reservar");

btn_reservar.addEventListener("click", () => {
    let formDados = {
        nome: document.getElementById("nome_cliente").value, 
        email: document.getElementById("email_cliente").value, 
        categoria: document.getElementById("categoria_veiculo").value
    };

    if (!formDados.nome || !formDados.email) {
        alert("Preencha todos os campos!"); 
        return;
    }

    fetch('http://localhost:3000/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDados)
    })
    .then(resposta => resposta.json()) 
    .then((dados) => {
        console.log("Sucesso:", dados); 
        alert("Reserva salva no banco de dados!");
        fnLimparCampos(); 
    })
    .catch(erro => console.log("Erro:", erro.message));
});