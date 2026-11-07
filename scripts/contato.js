/**
 * scripts/contato.js
 * Gerenciamento do envio do formulário de contato via EmailJS.
 */

function inicializarFormularioContato() {
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit');
  const contactFeedback = document.getElementById('contact-feedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (typeof window.carregarVariaveisDeAmbiente === 'function') {
      await window.carregarVariaveisDeAmbiente();
    }
    const config = window.EMAILJS_CONFIG || {};

    // Verificação amigável de credenciais não preenchidas
    if (!config.publicKey || config.publicKey === 'SUA_PUBLIC_KEY_AQUI' || config.publicKey === 'sua_public_key_aqui' ||
      !config.serviceId || config.serviceId === 'SEU_SERVICE_ID_AQUI' || config.serviceId === 'seu_service_id_aqui' ||
      !config.templateId || config.templateId === 'SEU_TEMPLATE_ID_AQUI' || config.templateId === 'seu_template_id_aqui') {
      contactFeedback.className = 'form-feedback warning';
      contactFeedback.textContent = 'Atenção: Configure suas credenciais no arquivo .env ou env.js (EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID).';
      return;
    }

    contactSubmitBtn.disabled = true;
    contactSubmitBtn.classList.add('loading');
    contactFeedback.className = 'form-feedback';
    contactFeedback.textContent = '';

    emailjs.sendForm(config.serviceId, config.templateId, this)
      .then(() => {
        contactFeedback.className = 'form-feedback success';
        contactFeedback.textContent = 'Mensagem enviada com sucesso! Logo entraremos em contato.';
        contactForm.reset();
      })
      .catch((error) => {
        console.error('Erro EmailJS:', error);
        contactFeedback.className = 'form-feedback error';
        contactFeedback.textContent = 'Ocorreu um erro ao enviar. Tente novamente ou use nossas redes sociais.';
      })
      .finally(() => {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.classList.remove('loading');
      });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarFormularioContato);
} else {
  inicializarFormularioContato();
}
