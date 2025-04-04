import fastify from 'fastify';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import QRCode from 'qrcode';

const app = fastify();

// Defina a porta de acordo com a variável de ambiente PORT fornecida pelo Render
const port = process.env.PORT || 10000;

const client = new Client({
    authStrategy: new LocalAuth(),
});

// Crie uma variável para armazenar o QR Code
let qrCodeUrl = '';

// Evento para gerar e salvar o QR Code
client.on("qr", qr => {
    // Gera uma URL de imagem do QR Code
    QRCode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code:', err);
        } else {
            qrCodeUrl = url; // Armazena a URL da imagem do QR Code
            console.log('QR Code gerado');
        }
    });
});

// Endpoint para exibir o QR Code na página como imagem
app.get('/qrcode', async (req, reply) => {
    if (!qrCodeUrl) {
        return reply.send('QR Code ainda não gerado.');
    }
    return reply.send(`
        <html>
            <body>
                <h1>QR Code para WhatsApp</h1>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <p>Escaneie o QR Code para autenticar.</p>
            </body>
        </html>
    `);
});

// Endpoint para verificar o status do bot
app.get('/status', async (req, reply) => {
    return reply.send('Bot do WhatsApp está rodando!');
});

// Inicializa o cliente do WhatsApp
client.initialize();

// Configuração do servidor Fastify para escutar na porta correta
app.listen({
    port: port,
    host: "0.0.0.0"
}).then(() => {
    console.log(`Servidor rodando na porta ${port}`);
}).catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
});
