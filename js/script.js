document.addEventListener('DOMContentLoaded', () => {
  setupGoogleSearch();
});

function setupGoogleSearch() {
  const btn = document.getElementById('googleSearchBtn');
  btn.addEventListener('click', handleGoogleSearch);
}

function handleGoogleSearch() {
  const query = document.getElementById('sourceText').value.trim();
  if (query) {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank');
  } else {
    alert('Vennligst fyll inn systemnavn for å søke.');
  }
}



function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');

  if (sidebar && hamburger) {
    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
      hamburger.textContent = '✕'; 
      hamburger.classList.add('open-icon'); 
    } else {
      hamburger.textContent = '☰'; 
      hamburger.classList.remove('open-icon'); 
    }
  }
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateDoc() {
  const form = document.getElementById('dpiaForm');
  const data = new FormData(form);
  let content = 'DPIA Sjekkliste\n\n';

  for (let [key, value] of data.entries()) {
    content += `${capitalize(key)}:\n${value}\n\n`;
  }

  const blob = new Blob([content], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'DPIA_Sjekkliste.doc';
  link.click();
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const form = document.getElementById('dpiaForm');
  const data = new FormData(form);
  let content = 'DPIA Sjekkliste\n\n';

  for (let [key, value] of data.entries()) {
    content += `${capitalize(key)}:\n${value}\n\n`;
  }

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);
  doc.save('DPIA_Sjekkliste.pdf');
}

function toggleLegalPanel() {
  const panel = document.getElementById("legalPanel");
  const buttonGroup = document.querySelector(".export-buttons");

  panel.classList.toggle("open");

  if (panel.classList.contains("open")) {
    buttonGroup.style.display = "none";
  } else {
    buttonGroup.style.display = "flex";

  }
}


let isResizing = false;

function startResize(e) {
  isResizing = true;
  document.addEventListener("mousemove", resizePanel);
  document.addEventListener("mouseup", stopResize);
}

function resizePanel(e) {
  if (!isResizing) return;
  const panel = document.getElementById("legalPanel");
  const newWidth = window.innerWidth - e.clientX;
  if (newWidth > 250 && newWidth < 700) {
    panel.style.width = newWidth + "px";
  }
}

function stopResize() {
  isResizing = false;
  document.removeEventListener("mousemove", resizePanel);
  document.removeEventListener("mouseup", stopResize);
}

document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

function openTranslater() {
  const tekst = document.getElementById("sourceText").value;
  const url = `https://translate.google.com/?sl=en&tl=no&text=${encodeURIComponent(tekst)}&op=translate`;
  window.open(url, "_blank");
}


//lagring
const feltIds = [
  'sourceText', 'purpose', 'necessity', 'legalBasis', 'dataTypes',
  'sensitive', 'volume', 'dataFlow', 'access', 'transfers',
  'retention', 'measures', 'risks'
];

window.addEventListener('load', () => {
  // Last inn verdier fra localStorage og fyll feltene
  feltIds.forEach(id => {
    const felt = document.getElementById(id);
    if (!felt) return;
    const lagretTekst = localStorage.getItem(id);
    if (lagretTekst !== null) {
      felt.value = lagretTekst;
    }
  });
});

document.getElementById('lagreKnapp').addEventListener('click', () => {
  // Lagre verdier til localStorage
   const formFields = ['purpose', 'necessity', 'legalBasis', 'dataTypes', 'sensitive', 'volume', 'dataFlow', 'access', 'transfers', 'retention', 'measures', 'risks'];
 
    formFields.forEach(id => {
        const value = document.getElementById(id).value;
        localStorage.setItem(id, value);
    });

    visStatusmelding('✔️ Data lagret', 'green');
});

function visStatusmelding(melding, farge) {
    const statusEl = document.getElementById('saveStatus');
    statusEl.textContent = melding;
    statusEl.style.color = farge || 'green';

    // Fjern meldingen etter 3 sekunder
    setTimeout(() => {
        statusEl.textContent = '';
    }, 3000);
}



