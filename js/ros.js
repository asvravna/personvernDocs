document.addEventListener("DOMContentLoaded", () => {
  const addRiskButton = document.getElementById('addRiskButton');
  const riskList = document.getElementById('riskList');

  addRiskButton.addEventListener('click', () => {
    const recipientInput = document.getElementById('textarea');
    const riskText = recipientInput.value.trim();

    if (riskText === "") {
      alert("Vennligst skriv inn en risiko før du laster opp.");
      return;
    }

    // Lag listeelement for risiko
    const listItem = document.createElement('li');
    listItem.className = 'risk-box';

    // Nedoverpil
    const downArrow = document.createElement('span');
    downArrow.textContent = '▼';
    downArrow.style.cursor = 'pointer';
    downArrow.style.marginLeft = '10px';

    // Sett risiko-tekst og legg til pil
    const textSpan = document.createElement('span');
    textSpan.textContent = riskText;
    listItem.appendChild(textSpan);

    // Nedtrekksikon
    listItem.appendChild(downArrow);

    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'icon-button';
    deleteButton.innerHTML = '🗑️';
    listItem.appendChild(deleteButton);
    // Container for detaljer
    const detailContainer = document.createElement('div');
    detailContainer.className = 'risk-details';
    detailContainer.style.display = 'none';

    const consequenceField = createInputField('Konsekvens:', 'consequence-input', 'Skriv konsekvens her');
    const tiltakField = createInputField('Tiltak:', 'tiltak-input', 'Skriv tiltak her');
    const sannsynlighetField = createInputField('Sannsynlighet:', 'sannsynlighet-input', 'Skriv sannsynlighet her');
    const integritetField = createInputField('Integritet:', 'integritet-input', 'Skriv integritet her');
    const konfidensialitetField = createInputField('Konfidensialitet:', 'konfidensialitet-input', 'Skriv konfidensialitet her');
    const tilgjengelighetField = createInputField('Tilgjengelighet:', 'tilgjengelighet-input', 'Skriv tilgjengelighet her');

  
    detailContainer.appendChild(consequenceField);
    detailContainer.appendChild(tiltakField);
    detailContainer.appendChild(sannsynlighetField);
    detailContainer.appendChild(integritetField);
    detailContainer.appendChild(konfidensialitetField);
    detailContainer.appendChild(tilgjengelighetField);


    const saveButton = document.createElement('button');
    saveButton.textContent = 'Lagre detaljer';
    saveButton.className = 'save-button';

    detailContainer.appendChild(saveButton);

    // Legg til i DOM
    riskList.appendChild(listItem);
    riskList.appendChild(detailContainer);

    recipientInput.value = ''; // Tøm tekstområde

    // Vis/skjul detaljer
    downArrow.addEventListener('click', () => {
      detailContainer.style.display = detailContainer.style.display === 'none' ? 'flex' : 'none';
    });

        saveButton.addEventListener('click', () => {
        const consequence = consequenceField.querySelector('input').value.trim();
        const tiltak = tiltakField.querySelector('input').value.trim();
        const sannsynlighet = sannsynlighetField.querySelector('input').value.trim();

        if (!consequence || !tiltak || !sannsynlighet) {
            alert("Vennligst fyll ut konsekvens, tiltak og sannsynlighet før du lagrer.");
            return;
        }

        // Fjern alert, bare lukk og evt. marker
        listItem.style.backgroundColor = '#e6ffe6'; // valgfri lagret-farge
        detailContainer.style.display = 'none';
        });
          // Slett-knappens funksjonalitet
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            detailContainer.remove();
        
        });

  });


});

// Eksport til Excel
document.getElementById('exportButton').addEventListener('click', () => {
  const risks = [];
  const riskItems = document.querySelectorAll('#riskList .risk-box');

  riskItems.forEach((item) => {
    const riskText = item.textContent.replace("▼", "").trim();
    const detailContainer = item.nextElementSibling;
    if (!detailContainer) return;

    const consequenceInput = detailContainer.querySelector('.consequence-input');
    const tiltakInput = detailContainer.querySelector('.tiltak-input');
    const sannsynlighetInput = detailContainer.querySelector('.sannsynlighet-input');

    risks.push({
      Risiko: riskText,
      Konsekvens: consequenceInput ? consequenceInput.value.trim() : '',
      Tiltak: tiltakInput ? tiltakInput.value.trim() : '',
      Sannsynlighet: sannsynlighetInput ? sannsynlighetInput.value.trim() : '',
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(risks);
  XLSX.utils.book_append_sheet(wb, ws, "Risikoer");
  XLSX.writeFile(wb, "risikoer.xlsx");
});

// Funksjon for å lage input-felt pakket i wrapper
function createInputField(labelText, className, placeholder) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper';

  const label = document.createElement('label');
  label.textContent = labelText;
  label.htmlFor = className;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = className;
  input.placeholder = placeholder;

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return wrapper;
}

