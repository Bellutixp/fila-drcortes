const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Variáveis do Sistema
let fila = [];
let historico = [];
let senhaContador = 1; // Este é o cara que precisamos resetar
let atendimentoAtual = null;

// Controle de Inatividade (2 horas)
let ultimaAtividade = Date.now();
const DOIS_HORAS = 2 * 60 * 60 * 1000;

// FUNÇÃO QUE FORÇA O RESET COMPLETO
function resetarSistemaTotal() {
    fila = [];
    historico = [];
    senhaContador = 1; // AQUI ESTÁ A CHAVE: VOLTA PARA O 01
    atendimentoAtual = null;
    ultimaAtividade = Date.now();
    console.log("--- SISTEMA ZERADO: CONTADOR VOLTOU PARA 1 ---");
}

// Monitor de inatividade
setInterval(() => {
    const agora = Date.now();
    if ((agora - ultimaAtividade) > DOIS_HORAS && fila.length === 0 && !atendimentoAtual) {
        resetarSistemaTotal();
    }
}, 60000);

// ROTA PARA GERAR SENHA
app.post("/gerar", (req, res) => {
    ultimaAtividade = Date.now();
    const { nome } = req.body;
    
    // Cria a senha usando o contador atual e DEPOIS soma +1
    const novaSenha = { 
        senha: senhaContador, 
        nome: nome || "Cliente", 
        status: "espera" 
    };
    
    senhaContador++; // Sobe para o próximo
    fila.push(novaSenha);
    res.json(novaSenha);
});

// ROTA QUE O BOTÃO DO BARBEIRO CHAMA
app.post("/reiniciar", (req, res) => {
    resetarSistemaTotal();
    res.json({ status: "sucesso", mensagem: "Contador resetado para 1" });
});

// OUTRAS ROTAS (CHAMAR, FINALIZAR, PAINEL...)
app.post("/chamar", (req, res) => {
    const index = fila.findIndex(s => s.status === "espera");
    if (index !== -1) {
        if (atendimentoAtual) historico.unshift(atendimentoAtual);
        fila[index].status = "chamando";
        atendimentoAtual = fila[index];
        res.json(atendimentoAtual);
    } else { res.status(404).json({ erro: "Vazia" }); }
});

app.post("/finalizar", (req, res) => {
    const { senha } = req.body;
    if (atendimentoAtual && atendimentoAtual.senha == senha) atendimentoAtual = null;
    fila = fila.filter(s => s.senha != senha);
    res.json({ mensagem: "OK" });
});

app.get("/painel", (req, res) => {
    res.json({ atual: atendimentoAtual, historico: historico.slice(0, 5) });
});

app.get("/fila", (req, res) => res.json(fila));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor rodando. Contador pronto no 1.");
});
