import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

import { Commands } from "./commands.js";
const command = new Commands()

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("ready", () => {
    console.log("cliente conectado");
});

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("message", async (msg) => {
    const commandUser = msg.body.toLowerCase();

    if(commandUser.startsWith("add")){
        const medicine = commandUser.replace("add", "").trim();
        command.post(medicine)

        return msg.reply(`_${medicine}_ Adicionado na falta!`)

        
        
    };

    if (commandUser === "falta?") {
      const data = await command.get()
      msg.reply(data)
    }

    if(commandUser.startsWith("/")){
        const medicine = commandUser.replace("/", "").trim();
        const getMedicine = await command.getMedicine(medicine);
        
        msg.reply(getMedicine);
    }
    
    if(commandUser.startsWith("esc")){
        const medicine = commandUser.replace("esc", "").trim();
        console.log(medicine)
        command.updateMedicine(medicine);

        return msg.reply(`${medicine} Saiu da falta!`)
    };
});

client.initialize();
