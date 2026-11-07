/**
 * scripts/env-loader.js
 * Gerenciamento de variáveis de ambiente e inicialização do SDK EmailJS.
 * Ordem de prioridade:
 * 1. window.ENV (via env.js ou bundler)
 * 2. Leitura assíncrona de .env local via fetch
 * 3. Fallback estático
 */

window.EMAILJS_CONFIG = {
  publicKey: (window.ENV && window.ENV.EMAILJS_PUBLIC_KEY) || 'SUA_PUBLIC_KEY_AQUI',
  serviceId: (window.ENV && window.ENV.EMAILJS_SERVICE_ID) || 'SEU_SERVICE_ID_AQUI',
  templateId: (window.ENV && window.ENV.EMAILJS_TEMPLATE_ID) || 'SEU_TEMPLATE_ID_AQUI'
};

window.carregarVariaveisDeAmbiente = async function carregarVariaveisDeAmbiente() {
  const config = window.EMAILJS_CONFIG;
  const precisaCarregar =
    config.publicKey === 'SUA_PUBLIC_KEY_AQUI' ||
    config.serviceId === 'SEU_SERVICE_ID_AQUI' ||
    config.templateId === 'SEU_TEMPLATE_ID_AQUI';

  if (precisaCarregar) {
    try {
      const resp = await fetch('.env');
      if (resp.ok) {
        const texto = await resp.text();
        const linhas = texto.split(/\r?\n/);
        const envMap = {};
        linhas.forEach(linha => {
          const semComentario = linha.split('#')[0].trim();
          if (semComentario) {
            const match = semComentario.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
              let val = (match[2] || '').trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
              }
              envMap[match[1]] = val;
            }
          }
        });

        if (envMap.EMAILJS_PUBLIC_KEY && envMap.EMAILJS_PUBLIC_KEY !== 'sua_public_key_aqui') {
          config.publicKey = envMap.EMAILJS_PUBLIC_KEY;
        }
        if (envMap.EMAILJS_SERVICE_ID && envMap.EMAILJS_SERVICE_ID !== 'seu_service_id_aqui') {
          config.serviceId = envMap.EMAILJS_SERVICE_ID;
        }
        if (envMap.EMAILJS_TEMPLATE_ID && envMap.EMAILJS_TEMPLATE_ID !== 'seu_template_id_aqui') {
          config.templateId = envMap.EMAILJS_TEMPLATE_ID;
        }
      }
    } catch (e) {
      // Arquivo .env inacessível ou não servido
    }
  }

  if (window.emailjs && config.publicKey && config.publicKey !== 'SUA_PUBLIC_KEY_AQUI') {
    emailjs.init({ publicKey: config.publicKey });
  }
};

// Dispara leitura inicial
window.carregarVariaveisDeAmbiente();
