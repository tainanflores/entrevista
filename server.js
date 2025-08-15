const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota da API para leads
app.post('/api/lead', async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        
        // Validar dados básicos
        const { name, email, whatsapp } = req.body;
        
        if (!name || !email || !whatsapp) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Dados obrigatórios: name, email, whatsapp' 
            });
        }
        
        // Validar WhatsApp (11 dígitos)
        if (!/^\d{11}$/.test(whatsapp)) {
            return res.status(400).json({ 
                ok: false, 
                error: 'WhatsApp deve ter exatamente 11 dígitos' 
            });
        }
        
        // Formatar número para formato internacional (55 + número)
        const phoneNumber = `55${whatsapp}`;
        
        // Montar mensagem personalizada
        const message = `Olá, ${name}! Obrigado por se cadastrar! Confira o resumo do que fiz na imagem em anexo!\n\nVocê pode baixar a versão completa do livro como arquivo de teste no link abaixo. 📚🔗\n\n\n https://drive.google.com/file/d/1VdmBuUCfjk32_-n9b6oP3mGUgVwjINE4/view?usp=sharing`;

        // Ler o arquivo PNG e converter para base64
        const filePath = path.join(__dirname, 'resumo.png');

        if (!fs.existsSync(filePath)) {
            throw new Error('Arquivo PNG não encontrado: ' + filePath);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const fileBase64 = fileBuffer.toString('base64');

        console.log('📄 PNG carregado:', {
            arquivo: 'resumo.png',
            tamanho: `${Math.round(fileBuffer.length / 1024)}KB`,
            base64Length: fileBase64.length
        });
        
        // Configurar dados para Evolution API
        const evolutionData = {
            mediatype: "image",
            mimetype: "image/png",
            media: fileBase64,
            caption: message,
            fileName: process.env.FILENAME || "resumo.png",
            linkPreview: true,
            number: phoneNumber
        };
        
        // URL da Evolution API
        const evolutionUrl = `${process.env.EVOLUTION_API_URL}/message/sendMedia/${process.env.EVOLUTION_INSTANCE}`;
        
        console.log('Enviando para Evolution API:', {
            url: evolutionUrl,
            phone: phoneNumber,
            name: name
        });
        
        // Enviar para Evolution API
        const response = await fetch(evolutionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.EVOLUTION_API_KEY
            },
            body: JSON.stringify(evolutionData)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            console.log('Mensagem enviada com sucesso via Evolution API:', responseData);
            res.status(200).json({ 
                ok: true, 
                message: 'Lead processado e mensagem WhatsApp enviada com sucesso!',
                data: {
                    name: name,
                    phone: phoneNumber,
                    status: 'sent'
                }
            });
        } else {
            throw new Error(`Evolution API retornou erro: ${response.status} - ${JSON.stringify(responseData)}`);
        }
        
    } catch (error) {
        console.error('Erro ao processar lead:', error);
        res.status(500).json({ 
            ok: false, 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos do diretório: ${__dirname}`);
});

module.exports = app;
