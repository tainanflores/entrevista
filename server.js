const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota da API para leads
app.post('/api/lead', async (req, res) => {
    const WEBHOOK_URL = "https://hook.us2.make.com/rmp5ou4vssh6m1wxuq4hj2kyhb07sfmx";
    
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
        
        // Enviar para Make.com
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        
        if (response.ok) {
            console.log('Lead enviado com sucesso para Make.com');
            res.status(200).json({ ok: true, message: 'Lead enviado com sucesso' });
        } else {
            throw new Error(`Make.com retornou status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Erro ao processar lead:', error);
        res.status(500).json({ 
            ok: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos do diretório: ${__dirname}`);
});

module.exports = app;
