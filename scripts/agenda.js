/**
 * scripts/agenda.js
 * Leitura assíncrona do arquivo agenda.md e renderização dinâmica
 * dos blocos por mês e lista de shows no container #agenda-container.
 */

async function carregarAgenda() {
  const container = document.getElementById('agenda-container');
  if (!container) return;

  try {
    const resp = await fetch('agenda.md');
    if (!resp.ok) {
      throw new Error('Não foi possível carregar agenda.md');
    }
    const texto = await resp.text();
    const linhas = texto.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    if (linhas.length === 0) {
      container.innerHTML = '<div class="agenda-empty">Nenhum show marcado no momento. Fique ligado!</div>';
      return;
    }

    const blocosPorMes = [];
    let mesAtual = null;

    linhas.forEach((linha) => {
      const limpa = linha.replace(/^[#\-\*]+\s*/, '').trim();
      if (!limpa) return;

      const matchShow = limpa.match(/^(\d{1,2})\s+([A-Za-zÀ-ÖØ-öø-ÿ]{3,4})\s+(.+)$/);

      if (matchShow) {
        if (!mesAtual) {
          mesAtual = { mes: 'PRÓXIMAS DATAS', shows: [] };
          blocosPorMes.push(mesAtual);
        }
        mesAtual.shows.push({
          dia: matchShow[1].padStart(2, '0'),
          semana: matchShow[2].toUpperCase(),
          local: matchShow[3]
        });
      } else {
        mesAtual = { mes: limpa.toUpperCase(), shows: [] };
        blocosPorMes.push(mesAtual);
      }
    });

    container.innerHTML = '';
    blocosPorMes.forEach((bloco) => {
      if (bloco.shows.length === 0) return;

      const blockEl = document.createElement('div');
      blockEl.className = 'agenda-month-block';

      const titleEl = document.createElement('h3');
      titleEl.className = 'agenda-month-title';
      titleEl.textContent = bloco.mes;
      blockEl.appendChild(titleEl);

      const listEl = document.createElement('ul');
      listEl.className = 'agenda-list';

      bloco.shows.forEach((show) => {
        const itemEl = document.createElement('li');
        itemEl.className = 'agenda-item';
        itemEl.innerHTML = `
          <span class="agenda-day-number">${show.dia}</span>
          <span class="agenda-day-week">${show.semana}</span>
          <span class="agenda-venue">${show.local}</span>
        `;
        listEl.appendChild(itemEl);
      });

      blockEl.appendChild(listEl);
      container.appendChild(blockEl);
    });

    if (container.children.length === 0) {
      container.innerHTML = '<div class="agenda-empty">Nenhum show marcado no momento. Fique ligado!</div>';
    }
  } catch (err) {
    console.error('Erro ao carregar agenda:', err);
    container.innerHTML = '<div class="agenda-error">Não foi possível carregar as datas dos shows no momento.</div>';
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', carregarAgenda);
} else {
  carregarAgenda();
}
