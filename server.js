const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let fila = [];
let historico = [];
let senhaContador = 1;
let atendimentoAtual = null;

let ultimaAtividade = Date.now();
const DOIS_HORAS = 2 * 60 * 60 * 1000;

function resetarSistemaTotal() {
    fila = [];
    historico = [];
    senhaContador = 1;
    atendimentoAtual = null;
    ultimaAtividade = Date.now();
    console.log("--- SISTEMA REINICIADO ---");
}

setInterval(() => {
    const agora = Date.now();
    if ((agora - ultimaAtividade) > DOIS_HORAS && fila.length === 0 && !atendimentoAtual) {
        resetarSistemaTotal();
    }
}, 60000);

// ROTA ATUALIZADA: Agora ela diz a senha atual ao gerar uma nova
app.post("/gerar", (req, res) => {
    ultimaAtividade = Date.now();
    const { nome } = req.body;
    
    const novaSenha = { 
        senha: senhaContador, 
        nome: nome || "Cliente", 
        status: "espera" 
    };

    // Pegamos qual senha está no painel AGORA
    const senhaNoPainel = atendimentoAtual ? atendimentoAtual.senha : "Aguardando";

    res.json({ 
        suaSenha: novaSenha.senha, 
        atendimentoAgora: senhaNoPainel 
    });
    
    senhaContador++;
    fila.push(novaSenha);
});

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

app.post("/reiniciar", (req, res) => {
    resetarSistemaTotal();
    res.json({ status: "sucesso" });
});

app.get("/painel", (req, res) => {
    res.json({ atual: atendimentoAtual, historico: historico.slice(0, 5) });
});

app.get("/fila", (req, res) => res.json(fila));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor Online com contador e status de espera.");
});
