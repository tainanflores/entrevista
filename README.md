# Landing Page com Evolution API

Sistema de captura de leads que envia automaticamente mensagens WhatsApp com arquivo PDF via Evolution API.

## 🚀 Funcionalidades

- ✅ Landing page responsiva
- ✅ Captura de leads (nome, email, WhatsApp)
- ✅ Validação de dados
- ✅ Envio automático de WhatsApp via Evolution API
- ✅ Envio de arquivo PDF em base64 (não requer URLs externas)
- ✅ Mensagem personalizada com dados do lead

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

```env
# Evolution API Configuration
EVOLUTION_API_URL=https://dev.teadigital.com.br
EVOLUTION_API_KEY=sua_api_key_aqui
EVOLUTION_INSTANCE=nome_da_instancia

# PDF Configuration
PDF_FILENAME=NomeDoArquivo.pdf

# Server Configuration (opcional)
PORT=3000
```

**Importante:** O arquivo PDF deve estar na raiz do projeto com o nome `Resumo Linux Pdf.pdf`. O sistema lerá este arquivo automaticamente e o converterá para base64 antes de enviar via WhatsApp.

### 2. Instalação

```bash
npm install
```

### 3. Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📱 Evolution API

O sistema utiliza a Evolution API para envio de mensagens WhatsApp. A API deve estar configurada com:

- ✅ Instância ativa e conectada
- ✅ API Key válida
- ✅ Permissões para envio de mídia

### Exemplo de curl para teste direto:

```bash
curl --request POST \
  --url https://dev.teadigital.com.br/message/sendMedia/entrevista \
  --header 'Content-Type: application/json' \
  --header 'apikey: SUA_API_KEY' \
  --data '{
  "mediatype": "document",
  "mimetype": "application/pdf",
  "media": "JVBERi0xLjQKJcfs...BASE64_DO_ARQUIVO_PDF",
  "caption": "Sua mensagem aqui",
  "fileName": "arquivo.pdf",
  "linkPreview": true,
  "number": "5537998347717"
}'
```

**Nota:** O campo `media` agora contém o arquivo PDF codificado em base64, não uma URL.

## 📋 API Endpoints

### POST /api/lead

Processa um novo lead e envia mensagem WhatsApp.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "whatsapp": "11999888777"
}
```

**Resposta (sucesso):**
```json
{
  "ok": true,
  "message": "Lead processado e mensagem WhatsApp enviada com sucesso!",
  "data": {
    "name": "João Silva",
    "phone": "5511999888777",
    "status": "sent"
  }
}
```

## 🏗️ Estrutura do Projeto

```
├── public/             # Arquivos públicos (servidos estaticamente)
│   ├── index.html      # Landing page
│   ├── styles.css      # Estilos CSS
│   └── script.js       # JavaScript frontend
├── server.js           # Servidor Express (privado)
├── resumo.png          # Arquivo de imagem a ser enviado (privado)
├── package.json        # Dependências Node.js
├── .env                # Configurações (não versionado/privado)
├── .env.example        # Exemplo de configurações
├── Dockerfile          # Configuração Docker
├── docker-compose.yml  # Orquestração Docker
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação
```

## 🔒 Segurança

- As configurações sensíveis estão no arquivo `.env`
- O arquivo `.env` não deve ser versionado (já configurado no `.gitignore`)
- **Apenas a pasta `public/` é servida estaticamente** - arquivos sensíveis ficam privados
- Use sempre HTTPS em produção
- Valide todos os dados de entrada
- O arquivo de imagem é lido localmente e convertido para base64 automaticamente
- API key da Evolution API nunca é exposta publicamente

### 🛡️ **Arquivos Protegidos (não acessíveis publicamente):**
- `.env` - Credenciais e configurações
- `server.js` - Código fonte da aplicação
- `resumo.png` - Arquivo original
- `package.json` - Informações do projeto
- Todos os outros arquivos da raiz

## 📱 Como Funciona

1. **Captura de Lead**: O usuário preenche o formulário na landing page
2. **Validação**: Os dados são validados no servidor (nome, email, WhatsApp)
3. **Processamento**: O arquivo PDF é lido e convertido para base64
4. **Envio WhatsApp**: Uma mensagem personalizada é enviada via Evolution API com o PDF anexado
5. **Resposta**: O usuário recebe confirmação do sucesso/erro da operação

## 🐳 Docker

O projeto inclui configuração Docker para fácil deploy:

```bash
# Build
docker build -t entrevista .

# Run
docker run -p 3000:3000 --env-file .env entrevista
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Execute o script de teste
3. Confirme se a Evolution API está ativa
4. Valide as configurações do arquivo `.env`
