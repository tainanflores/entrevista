#!/bin/bash

echo "🚀 Fazendo deploy da aplicação..."
echo "📋 Subdomínio: chat.teadigital.com.br"
echo ""

# Parar containers existentes
echo "⏹️  Parando containers existentes..."
docker-compose down

# Rebuild da imagem
echo "🔨 Construindo nova imagem..."
docker-compose build --no-cache

# Iniciar containers
echo "▶️  Iniciando containers..."
docker-compose up -d

# Verificar status
echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://chat.teadigital.com.br"
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "📋 Para ver logs:"
echo "   docker-compose logs -f chatapp"
