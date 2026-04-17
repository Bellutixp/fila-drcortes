const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let fila = [];
let historico = [];
let senhaContador = 1;
let atendimentoAtual = null;

app.post("/gerar", (req, res) => {
    const { nome } = req.body;
    const novaSenha = {
        senha: senhaContador++,
        nome: nome || "Cliente",
        status: "espera"
    };
    fila.push(novaSenha);
    res.json(novaSenha);
});

app.get("/fila", (req, res) => res.json(fila));

app.post("/chamar", (req, res) => {
    const index = fila.findIndex(s => s.status === "espera");
    if (index !== -1) {
        if (atendimentoAtual) historico.unshift(atendimentoAtual);
        fila[index].status = "chamando";
        atendimentoAtual = fila[index];
        res.json(atendimentoAtual);
    } else {
        res.status(404).json({ erro: "Fila vazia!" });
    }
});

app.post("/finalizar", (req, res) => {
    const { senha } = req.body;
    if (atendimentoAtual && atendimentoAtual.senha == senha) {
        historico.unshift(atendimentoAtual);
        atendimentoAtual = null;
    }
    fila = fila.filter(s => s.senha != senha);
    res.json({ mensagem: "Finalizado" });
});

app.get("/painel", (req, res) => {
    res.json({
        atual: atendimentoAtual,
        fila: fila.filter(s => s.status === "espera").length,
        historico: historico.slice(0, 5)
    });
});

// ISSO AQUI É O QUE FAZ O 4G FUNCIONAR NA NUVEM:
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`--- SISTEMA DR. CORTES RODANDO NA PORTA ${PORT} ---`);
});