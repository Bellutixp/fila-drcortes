const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Variáveis do Sistema
let fila = [];
let historico = [];
let senhaContador = 1;
let atendimentoAtual = null;

// Controle de Inatividade (2 horas)
let ultimaAtividade = Date.now();
const DOIS_HORAS = 2 * 60 * 60 * 1000;

function resetarSistemaTotal() {
    fila = [];
    historico = [];
    senhaContador = 1;
    atendimentoAtual = null;
    ultimaAtividade = Date.now();
    console.log("--- RESET TOTAL REALIZADO ---");
}

// Monitor de inatividade
setInterval(() => {
    const agora = Date.now();
    if ((agora - ultimaAtividade) > DOIS_HORAS && fila.length === 0 && !atendimentoAtual) {
        resetarSistemaTotal();
    }
}, 60000);

// 1. GERA SENHA (E diz quem está sendo atendido agora)
app.post("/gerar", (req, res) => {
    ultimaAtividade = Date.now();
    const { nome } = req.body;
    const novaSenha = { senha: senhaContador++, nome: nome || "Cliente", status: "espera" };
    fila.push(novaSenha);

    // Retorna para o cliente a senha dele e quem está na cadeira
    res.json({ 
        suaSenha: novaSenha.senha, 
        atendimentoAgora: atendimentoAtual ? atendimentoAtual.senha : "Aguardando" 
    });
});

// 2. CHAMAR PRÓXIMO (Vai para a cadeira)
app.post("/chamar", (req, res) => {
    ultimaAtividade = Date.now();
    const index = fila.findIndex(s => s.status === "espera");
    
    if (index !== -1) {
        // Se já tinha alguém, manda pro histórico
        if (atendimentoAtual) historico.unshift(atendimentoAtual);
        
        // Pega o próximo da fila e coloca no atendimentoAtual
        fila[index].status = "chamando";
        atendimentoAtual = fila[index];
        res.json(atendimentoAtual);
    } else {
        res.status(404).json({ erro: "Fila vazia" });
    }
});

// 3. FINALIZAR (Tira da cadeira)
app.post("/finalizar", (req, res) => {
    const { senha } = req.body;
    if (atendimentoAtual && atendimentoAtual.senha == senha) {
        historico.unshift(atendimentoAtual);
        atendimentoAtual = null;
    }
    fila = fila.filter(s => s.senha != senha);
    res.json({ mensagem: "Atendimento finalizado" });
});

// 4. REINICIAR TUDO (Botão Manual)
app.post("/reiniciar", (req, res) => {
    resetarSistemaTotal();
    res.json({ status: "sucesso" });
});

// 5. ROTAS DE CONSULTA (Painel TV e Fila)
app.get("/painel", (req, res) => {
    res.json({ atual: atendimentoAtual, historico: historico.slice(0, 5) });
});

app.get("/fila", (req, res) => res.json(fila));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor Dr. Cortes: Sistema Completo Online.");
});
