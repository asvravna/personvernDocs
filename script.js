function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');

  if (sidebar && hamburger) {
    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
      hamburger.textContent = '✕'; // X icon
      hamburger.classList.add('open-icon'); // add white color class
    } else {
      hamburger.textContent = '☰'; // hamburger icon
      hamburger.classList.remove('open-icon'); // remove white color class
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
  panel.classList.toggle("open");
}


// Drag-to-resize logic
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

document.getElementById('year').textContent = new Date().getFullYear();
