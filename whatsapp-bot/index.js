const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("🌸 Iniciando Servidor Bot de Flores By Dolly...");

// Inicializar el cliente con guardado de sesión local y configuraciones para Puppeteer en Docker
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Evento: Generar QR para inicio de sesión
client.on('qr', (qr) => {
    console.log("📲 ESCANEA ESTE CÓDIGO QR CON EL WHATSAPP DE LA FLORERÍA:");
    qrcode.generate(qr, { small: true });
});

// Evento: Cliente listo y conectado
client.on('ready', () => {
    console.log("✅ ¡El bot de WhatsApp está conectado y listo para recibir mensajes!");
});

// Evento: Cliente desconectado
client.on('disconnected', (reason) => {
    console.log('❌ El bot fue desconectado:', reason);
});

// Evento: Recepción de mensajes
client.on('message', async msg => {
    // Evitar responder a grupos o estados
    if (msg.isGroupMsg || msg.isStatus) return;

    const textoRecibido = msg.body.trim();

    // Comprobar si el mensaje contiene la frase clave que envía la web
    if (textoRecibido.includes('¡Hola Dolly! Aquí envío mis datos para participar en la rifa.')) {
        
        console.log(`📩 Mensaje de rifa recibido de: ${msg.from}`);

        // Extraer nombres usando expresiones regulares basadas en el formato del mensaje
        const nombreMatch = textoRecibido.match(/Mi nombre es (.*?) y mi número es/i);
        const nombreCliente = nombreMatch ? nombreMatch[1].trim() : 'Amigo(a)';

        const referidoMatch = textoRecibido.match(/1\. Nombre: (.*?) - Celular:/i);
        const nombreReferido = referidoMatch ? referidoMatch[1].trim() : 'tu invitado';

        // Respuesta automática dinámica inspirada en Meta AI
        const respuestaBot = `¡Hola, ${nombreCliente}! Qué alegría saludarte. He recibido correctamente tus datos y los de tu referido, ${nombreReferido}. ¡Ya estás oficialmente registrado en nuestra rifa y cuentas con tu 20% de descuento! 🎟️✨

¿Te gustaría aprovechar ese descuento para elegir algún detalle especial de nuestro catálogo hoy? Tenemos opciones increíbles que te encantarán. 
https://www.floresbydolly.com/catalogo`;

        try {
            // Simular que el bot está "escribiendo..." para mayor naturalidad
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            
            // Pequeño delay de 2 segundos simulando que escribe
            setTimeout(async () => {
                await msg.reply(respuestaBot);
                console.log(`✅ Respuesta automática enviada a: ${msg.from}`);
            }, 2000);

        } catch (error) {
            console.error('❌ Error al enviar la respuesta automática:', error);
        }
    }
});

// Inicializar el cliente
client.initialize();
