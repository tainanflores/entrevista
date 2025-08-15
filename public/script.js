// Máscara para WhatsApp
document.getElementById('whatsapp').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + 9 números)
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // Aplicar máscara
    if (value.length >= 2) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (value.length >= 10) {
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    e.target.value = value;
    
    // Validar em tempo real
    validateWhatsApp(value);
});

// Função para validar WhatsApp
function validateWhatsApp(value) {
    const whatsappError = document.getElementById('whatsappError');
    const whatsappInput = document.getElementById('whatsapp');
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length > 0 && cleanValue.length < 11) {
        whatsappError.style.display = 'block';
        whatsappInput.style.borderColor = '#dc3545';
        return false;
    } else if (cleanValue.length === 11) {
        whatsappError.style.display = 'none';
        whatsappInput.style.borderColor = '#28a745';
        return true;
    } else if (cleanValue.length === 0) {
        whatsappError.style.display = 'none';
        whatsappInput.style.borderColor = '#e1e5e9';
        return false;
    }
    return false;
}

// Manipulação do formulário
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validar WhatsApp antes de enviar
    const whatsappValue = document.getElementById('whatsapp').value;
    const cleanWhatsApp = whatsappValue.replace(/\D/g, '');
    
    if (cleanWhatsApp.length !== 11) {
        document.getElementById('whatsappError').style.display = 'block';
        document.getElementById('whatsapp').focus();
        return;
    }
    
    // Ocultar mensagens anteriores
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Mostrar loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'block';
    
    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        whatsapp: cleanWhatsApp // Envia apenas números
    };

    try {
        // Requisição POST para a API (URL relativa para funcionar em produção)
        const response = await fetch('/api/lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Sucesso
            successMessage.style.display = 'block';
            form.reset();
        } else {
            throw new Error('Erro na requisição');
        }
        
    } catch (error) {
        // Erro
        console.error('Erro:', error);
        errorMessage.style.display = 'block';
    } finally {
        // Restaurar botão
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loading.style.display = 'none';
    }
});
