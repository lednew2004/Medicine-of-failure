import fastify from 'fastify';
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } =  pkg;

import qrcode from 'qrcode-terminal';

const app = fastify();

// Defina a porta de acordo com a variável de ambiente PORT fornecida pelo Render
const port = process.env.port || 10000;

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("ready", () => {
    console.log("Cliente WhatsApp conectado!");
});

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("message", async (msg) => {
    const commandUser = msg.body.toLowerCase();

    if(commandUser.startsWith("add")){
        const medicine = commandUser.replace("add", "").trim();
        // Supondo que a função 'command.post' seja de um arquivo importado
        command.post(medicine);
        return msg.reply(`_${medicine}_ Adicionado na falta!`);
    }

    if (commandUser === "falta?") {
      const data = await command.get();
      msg.reply(data);
    }

    if(commandUser.startsWith("/")){
        const medicine = commandUser.replace("/", "").trim();
        const getMedicine = await command.getMedicine(medicine);
        msg.reply(getMedicine);
    }
    
    if(commandUser.startsWith("esc")){
        const medicine = commandUser.replace("esc", "").trim();
        console.log(medicine);
        command.updateMedicine(medicine);
        return msg.reply(`${medicine} Saiu da falta!`);
    }
});

// Inicializa o cliente WhatsApp
client.initialize();

// Configuração do Express para escutar na porta correta
app.listen({
    port: port,
    host: "0.0.0.0"
}).then(() => {
    console.log(`Servidor rodando na porta ${port}`);
  }).catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
  });