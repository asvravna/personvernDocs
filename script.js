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
