const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const venom = require("venom-bot");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // pasta para index.html e style.css

// 🟢 Números que vão enviar as mensagens
const numeroManicure = "5543998724137";     // 👉 coloque o número da manicure aqui
const numeroCabeleireira = "5543999936435"; // 👉 coloque o número da cabeleireira aqui

let botManicure;
let botCabeleireira;

// Criar sessão do Venom para cada número
venom.create({ session: "manicure" }).then(client => {
  botManicure = client;
  console.log("✅ Bot da Manicure conectado!");
});

venom.create({ session: "cabeleireira" }).then(client => {
  botCabeleireira = client;
  console.log("✅ Bot da Cabeleireira conectado!");
});

// Rota para receber agendamento
app.post("/agendar", async (req, res) => {
  try {
    const { nome, telefone, categoria, servicos } = req.body;

    if (!nome || !telefone || !categoria || !servicos) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const mensagem = `✨ Olá *${nome}*! 
Recebemos seu pedido para *${categoria.toUpperCase()}*.

📋 Serviços escolhidos: ${servicos.join(", ")}

Em breve confirmaremos seu agendamento ✅`;

    if (categoria === "manicure" && botManicure) {
      await botManicure.sendText(telefone + "@c.us", mensagem);
      console.log(`📩 Mensagem enviada para ${telefone} via Manicure`);
    } else if (categoria === "cabeleireira" && botCabeleireira) {
      await botCabeleireira.sendText(telefone + "@c.us", mensagem);
      console.log(`📩 Mensagem enviada para ${telefone} via Cabeleireira`);
    } else {
      return res.status(500).json({ error: "Bot não conectado ainda" });
    }

    res.json({ success: true, message: "Agendamento enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
