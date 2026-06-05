require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Escaneá este QR con WhatsApp > Dispositivos vinculados');
});

client.on('ready', () => {
    console.log('🇦🇷 Itachi Uchiha activo | Creado por Benjare 🥷');
});

// PRESENTACIÓN COMPLETA
const PRESENTACION = `🥷 ITACHI UCHIHA - BOT OFICIAL 🇦🇷

¡Saludos! Soy *Itachi Uchiha*, llego con honor desde *Argentina*.
Fui creado y desarrollado por *Benjare*, quien me dio vida para estar siempre a tu servicio las 24 horas.

> ❝ *El conocimiento es el único poder verdadero.* ❞

⚡ *TODO LO QUE PUEDO HACER:*

🤖 **INTELIGENCIA ARTIFICIAL**
!ia [pregunta] → Te respondo con sabiduría
!gpt [texto] → ChatGPT integrado, charlamos de todo
!definir [palabra] → Explicación clara
!traducir [es>en] texto → Traduzco lo que quieras

🎨 **CREACIÓN Y EDICIÓN**
!foto [descripción] → Genero imágenes únicas
!anime [tema] → Arte estilo anime
!sticker → Poné esto debajo de una foto y la convierto en sticker
!fondo [color/estilo] → Fondos para tu celular

🎵🎬 **DESCARGAS**
!mp3 [canción/artista] → Descargo música directo
!video [nombre/enlace] → Bajo videos de YouTube
!apk [nombre app/juego] → Te paso el archivo instalable directo

🎮 **JUEGOS Y ENTRETENIMIENTO**
!ppt → Piedra, papel o tijera
!adivina → Juego de lógica
!palabras → Juego de palabras encadenadas
!frase → Frase legendaria del Clan Uchiha
!facto → Dato curioso de la vida cotidiana
!sabiduria → Una enseñanza para reflexionar

ℹ️ **DATOS**
!creador → Sabés quién me hizo
!ayuda → Volver a ver este menú

🇦🇷 Orgullosamente hecho en Argentina 🇦🇷
*El Sharingan vigila y te ayuda siempre.*`;

client.on('message', async msg => {
    const texto = msg.body.toLowerCase().trim();

    // RESPUESTAS GENERALES
    if(texto === 'hola' || texto === 'itachi') return msg.reply(PRESENTACION);
    if(texto === 'quien eres' || texto === 'quién eres') return msg.reply('Soy *Itachi Uchiha*, tu compañero digital. Diseñado y programado en Argentina por *Benjare*. Todo lo que sé, él me lo enseñó. 🇦🇷🥷');
    if(texto === 'creador') return msg.reply('Todo esto existe gracias a *Benjare*. Él dio vida a mi código aquí en Argentina. 🇦🇷');
    if(texto === 'ayuda') return msg.reply(PRESENTACION);
    if(texto === 'buenas noches') return msg.reply('🌙 Descansá tranquilo. Desde Argentina te cuido toda la noche. Que la paz te acompañe. 🇦🇷');

    // 🧠 INTELIGENCIA ARTIFICIAL Y CHATGPT
    if(texto.startsWith('!ia ')){
        let consulta = texto.slice(4);
        try{
            let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt4?text=${encodeURIComponent(consulta)}`);
            msg.reply(`🤖 *INTELIGENCIA ITACHI*\n\n${res.data.result}\n\n🇦🇷 Argentina`);
        }catch{ msg.reply('❌ La sabiduría está ocupada, probá de nuevo en un momento.'); }
    }

    if(texto.startsWith('!gpt ')){
        let pregunta = texto.slice(5);
        try{
            let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt?text=${encodeURIComponent(pregunta)}`);
            msg.reply(`✨ *CHATGPT INTEGRADO*\n\n${res.data.result}\n\n🥷 Itachi-Bot | Argentina`);
        }catch{ msg.reply('❌ No pude conectar con la inteligencia ahora, intentá más tarde.'); }
    }

    // 🖼️ GENERAR IMÁGENES
    if(texto.startsWith('!foto ')){
        let tema = texto.slice(6);
        msg.reply('🎨 Creando tu imagen con el poder del Sharingan... esperame 🇦🇷');
        try{
            let res = await axios.get(`https://api.siputzx.my.id/api/ai/dalle?prompt=${encodeURIComponent(tema)}`, { responseType: 'arraybuffer' });
            await client.sendMessage(msg.from, new Buffer.from(res.data), { mimetype: 'image/png', caption: `✅ Imagen creada 🎨\nPor Itachi Uchiha | Creado por Benjare 🇦🇷` });
        }catch{ msg.reply('❌ No pude crearla, intentá escribir la descripción más simple.'); }
    }

    // 🎵 DESCARGAR MÚSICA
    if(texto.startsWith('!mp3 ')){
        let nombre = texto.slice(5);
        msg.reply('🎵 Buscando y preparando tu canción... directo desde Argentina 🇦🇷');
        try{
            let buscar = await axios.get(`https://api.siputzx.my.id/api/ytsearch?q=${encodeURIComponent(nombre)}`);
            let id = buscar.data.result[0].videoId;
            let titulo = buscar.data.result[0].title;
            let descarga = await axios.get(`https://api.siputzx.my.id/api/ytdl/mp3?url=https://youtu.be/${id}`, { responseType: 'arraybuffer' });
            await client.sendMessage(msg.from, new Buffer.from(descarga.data), { mimetype: 'audio/mpeg', filename: `${titulo}.mp3`, caption: `✅ Listo 🎶\nEnviado por Itachi Uchiha 🇦🇷` });
        }catch{ msg.reply('❌ No encontré esa canción, revisá bien el nombre.'); }
    }

    // 📹 DESCARGAR VIDEO
    if(texto.startsWith('!video ')){
        let nombre = texto.slice(6);
        msg.reply('🎬 Preparando tu video, esto puede tardar unos segundos 🇦🇷');
        try{
            let buscar = await axios.get(`https://api.siputzx.my.id/api/ytsearch?q=${encodeURIComponent(nombre)}`);
            let id = buscar.data.result[0].videoId;
            let titulo = buscar.data.result[0].title;
            let descarga = await axios.get(`https://api.siputzx.my.id/api/ytdl/mp4?url=https://youtu.be/${id}`, { responseType: 'arraybuffer' });
            await client.sendMessage(msg.from, new Buffer.from(descarga.data), { mimetype: 'video/mp4', filename: `${titulo}.mp4`, caption: `✅ Video listo 🎥\nHecho en Argentina 🇦🇷` });
        }catch{ msg.reply('❌ No pude bajar el video, probá con otro.'); }
    }

    // 📲 DESCARGAR APK
    if(texto.startsWith('!apk ')){
        let app = texto.slice(5);
        msg.reply('📲 Buscando el archivo instalable para vos... 🇦🇷');
        try{
            let res = await axios.get(`https://api.siputzx.my.id/api/download/apk?q=${encodeURIComponent(app)}`);
            if(res.data.status){
                await client.sendMessage(msg.from, res.data.data.link, { caption: `✅ APK encontrada 📲\n${res.data.data.nombre}\nDescargalo seguro. Por Itachi Uchiha 🇦🇷` });
            } else throw 0;
        }catch{ msg.reply('❌ Esa aplicación no la tengo disponible ahora.'); }
    }

    // 🖼️ HACER STICKER
    if(texto === '!sticker' && msg.hasMedia){
        msg.reply('✨ Transformando tu foto en un sticker genial... 🥷');
        const media = await msg.downloadMedia();
        await client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerName: "Itachi-Bot", stickerAuthor: "Benjare 🇦🇷" });
    }

    // 📚 DATOS COTIDIANOS Y REFLEXIONES
    if(texto === '!facto'){
        const hechos = [
            "💡 Si estornudaramos con mucha fuerza, podríamos llegar a romper una costilla.",
            "💡 La gente creativa sueña más y recuerda mejor sus sueños.",
            "💡 La vida promedio de una hormiga es de unos 15 años, pero siempre trabaja en equipo.",
            "💡 Sonreír cambia tu estado de ánimo aunque estés triste, el cerebro lo cree real.",
            "💡 En toda tu vida caminás una distancia equivalente a dar la vuelta al mundo 3 veces."
        ];
        let aleatorio = hechos[Math.floor(Math.random()*hechos.length)];
        msg.reply(`${aleatorio}\n🇦🇷 Dato traído desde Argentina`);
    }

    if(texto === '!sabiduria'){
        const frases = [
            "❝ El dolor nos enseña a valorar la felicidad cuando llega. ❞",
            "❝ Nunca te rías de los sueños de nadie; quien no sueña, no avanza. ❞",
            "❝ El tiempo pasa igual para todos, pero la forma de usarlo es decisión tuya. ❞",
            "❝ Ser fiel a uno mismo es más importante que agradar a todos. ❞",
            "❝ Aprender de los errores es la única forma de no repetirlos. ❞
        ];
        let aleatorio = frases[Math.floor(Math.random()*frases.length)];
        msg.reply(`${aleatorio}\n🥷 Itachi Uchiha 🇦🇷`);
    }

    // 🎮 JUEGOS
    if(texto === '!palabras'){
        const inicio = ["árbol","león","nube","fuego","libertad","mariposa","camino"];
        let pal = inicio[Math.floor(Math.random()*inicio.length)];
        msg.reply(`🎮 JUEGO DE PALABRAS 📖\n\nEmpiezo yo: *${pal}*\nTu palabra debe empezar con la última letra de la mía: *${pal.slice(-1)}*\nEscribime tu respuesta 🇦🇷`);
    }

    if(texto === '!ppt'){
        let opc = ['piedra','papel','tijera'];
        let yo = opc[Math.floor(Math.random()*3)];
        msg.reply(`✊✋✌️ PIEDRA PAPEL O TIJERA\nYo jugué: *${yo}*\n¿Quién ganó? Jugamos desde Argentina 🇦🇷`);
    }

    if(texto === '!frase'){
        msg.reply(`❝ *A veces debes sufrir para entender, caer para crecer y perder para ganar.* ❞\n— Itachi Uchiha 🇦🇷`);
    }
});

client.initialize();
