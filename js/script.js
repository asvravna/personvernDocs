let uploadedImage = null;

document.addEventListener("DOMContentLoaded", () => {
  setupGoogleSearch();
  setupPasteImage();
  setupSaveButton();
  setupPhotoUploadPreview();
  updateYear();
  loadSavedData();

  const photoUpload = document.getElementById("photoUpload");
  const pastedImage = document.getElementById("pastedImage");

  photoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      pastedImage.src = e.target.result;
      pastedImage.style.display = "block";
      uploadedImage = e.target.result;
    };

    reader.readAsDataURL(file);
  });
});

function setupGoogleSearch() {
  const btn = document.getElementById("googleSearchBtn");
  if (btn) {
    btn.addEventListener("click", handleGoogleSearch);
  }
}

function handleGoogleSearch() {
  const query = document.getElementById("sourceText").value.trim();
  if (query) {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
  } else {
    alert("Vennligst fyll inn systemnavn for å søke.");
  }
}

let pastedImageBlob = null;

function setupPasteImage() {
  const pasteArea = document.getElementById("pasteArea");
  if (pasteArea) {
    pasteArea.addEventListener("paste", (event) => {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          pastedImageBlob = blob;

          const reader = new FileReader();
          reader.onload = function (e) {
            const img = document.getElementById("pastedImage");
            if (img) {
              img.src = e.target.result;
              img.style.display = "block";
            }
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    });
  }
}

function setupPhotoUploadPreview() {
  const photoUploadInput = document.getElementById("photoUpload");
  if (photoUploadInput) {
    photoUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage = e.target.result;
        localStorage.setItem("uploadedImage", uploadedImage);
        updatePhotoPreview(uploadedImage);
      };
      reader.readAsDataURL(file);
    });
  }
}

function updatePhotoPreview(imageSrc) {
  const previewContainer = document.getElementById("photoPreview");

  if (previewContainer) {
    previewContainer.innerHTML = `
            <img src="${imageSrc}" alt="Lastet bilde" style="max-width: 300px; display: block;" />
        `;
  }
}

function loadSavedData() {
  const feltIds = [
    "sourceText",
    "scope",
    "type",
    "legalBasis",
    "dataTypes",
    "sensitive",
    "volume",
    "dataFlow",
    "access",
    "transfers",
    "retention",
    "measures",
    "risks",
    "photoDescription",
  ];

  feltIds.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      field.value = saved;
    }
  });

  const savedImage = localStorage.getItem("uploadedImage");
  if (savedImage) {
    uploadedImage = savedImage;
    updatePhotoPreview(savedImage);
  }
}

function setupSaveButton() {
  const saveBtn = document.getElementById("lagreKnapp");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const feltIds = [
      "sourceText",
      "scope",
      "type",
      "legalBasis",
      "dataTypes",
      "sensitive",
      "volume",
      "dataFlow",
      "access",
      "transfers",
      "retention",
      "measures",
      "risks",
      "photoDescription",
    ];

    feltIds.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      localStorage.setItem(id, field.value);
    });

    if (uploadedImage) {
      localStorage.setItem("uploadedImage", uploadedImage);
    }

    showSaveMessage("Lagret!");
  });
}

function showSaveMessage(message) {
  const saveMessageDiv = document.getElementById("saveMessage");
  if (!saveMessageDiv) return;

  saveMessageDiv.textContent = message;
  saveMessageDiv.style.display = "block";

  setTimeout(() => {
    saveMessageDiv.style.display = "none";
  }, 3000);
}

function updateYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function showSnackbar(key) {
  const snackbar = document.getElementById("snackbar");
  const snackbarText = document.getElementById("snackbarText");
  if (!snackbar || !snackbarText) return;

  snackbarText.textContent =
    infoTexts?.[key] || "Ingen informasjon tilgjengelig.";
  snackbar.classList.add("show");
}

function hideSnackbar() {
  const snackbar = document.getElementById("snackbar");
  if (!snackbar) return;

  snackbar.classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const photoUpload = document.getElementById("photoUpload");
  const pastedImage = document.getElementById("pastedImage");
  const photoDescription = document.getElementById("photoDescription");
  const pasteArea = document.getElementById("pasteArea");

  const savedImage = localStorage.getItem("uploadedImage");
  const savedDescription = localStorage.getItem("photoDescription");

  if (savedImage) {
    pastedImage.src = savedImage;
    pastedImage.style.display = "block";
  }
  if (savedDescription) {
    photoDescription.value = savedDescription;
  }

  function resizeImage(dataUrl, maxWidth, maxHeight, callback) {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL("image/png", 0.8);
      callback(resizedDataUrl);
    };
    img.src = dataUrl;
  }

  function saveImage(dataUrl) {
    try {
      localStorage.setItem("uploadedImage", dataUrl);
      pastedImage.src = dataUrl;
      pastedImage.style.display = "block";
      showStatus("Bilde lagret lokalt!");
    } catch (e) {
      alert("Bildet er for stort til å lagres. Prøv et mindre bilde.");
      console.error(e);
    }
  }

  function showStatus(msg) {
    const status = document.getElementById("saveStatus");
    status.textContent = msg;
    setTimeout(() => {
      status.textContent = "";
    }, 3000);
  }

  photoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      resizeImage(e.target.result, 800, 800, (resizedDataUrl) => {
        saveImage(resizedDataUrl);
      });
    };
    reader.readAsDataURL(file);
  });

  pasteArea.addEventListener("paste", (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          resizeImage(e.target.result, 800, 800, (resizedDataUrl) => {
            saveImage(resizedDataUrl);
          });
        };
        reader.readAsDataURL(blob);

        event.preventDefault();
        break;
      }
    }
  });
});
function nullstill() {
  localStorage.removeItem("uploadedImage");

  document.getElementById("pastedImage").src = "";
  document.getElementById("pastedImage").style.display = "none";
  document.getElementById("photoUpload").value = "";

  document.getElementById("pasteArea").innerHTML = "";

  const form = document.getElementById("dpiaForm");
  if (form) {
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else {
        el.value = "";
      }
    });
  }

  document
    .querySelectorAll('#dpiaForm textarea, #dpiaForm input[type="text"]')
    .forEach((el) => (el.value = ""));

  showSaveMessage("Skjema nullstilt!");
}

function getImageBase64(imgElement) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (err) => reject(err);
    img.src = imgElement.src;
  });
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const form = document.getElementById("dpiaForm");
  const data = new FormData(form);
  let content = "DPIA Sjekkliste\n\n";

  for (let [key, value] of data.entries()) {
    content += `${capitalize(key)}:\n${value}\n\n`;
  }

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);

  const imgElement = document.getElementById("pastedImage");
  if (imgElement && imgElement.src && imgElement.style.display !== "none") {
    try {
      doc.addImage(imgElement.src, "PNG", 10, 100, 60, 60);
    } catch (e) {
      console.error("Failed to add image to PDF:", e);
    }
  }

  doc.save("DPIA_Sjekkliste.pdf");
}

function generateDoc() {
  const form = document.getElementById("dpiaForm");
  const data = new FormData(form);

  const photoImg = document.getElementById("photoPreview");
  let photoHTML = "";
  if (photoImg && photoImg.src) {
    photoHTML = `<img src="${photoImg.src}" style="max-width: 400px; height: auto;" /><br/>`;
  }

  let content = `<html><head><meta charset="UTF-8"></head><body>`;
  content += `<h1>DPIA Sjekkliste</h1>`;

  for (let [key, value] of data.entries()) {
    content += `<strong>${capitalize(key)}</strong>:<br/>${value}<br/><br/>`;
  }

  content += photoHTML;
  content += `</body></html>`;

  const blob = new Blob([content], { type: "application/msword" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "DPIA_Sjekkliste.doc";
  link.click();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");

  sidebar.classList.toggle("open");

  if (sidebar.classList.contains("open")) {
    document.addEventListener("click", handleOutsideClick);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }

  function handleOutsideClick(event) {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
      sidebar.classList.remove("open");
      document.removeEventListener("click", handleOutsideClick);
    }
  }
}
let isLegalPanelOpen = false;

function toggleLegalTab() {
  const panel = document.getElementById("legalPanel");
  isLegalPanelOpen = !isLegalPanelOpen;
  panel.style.display = isLegalPanelOpen ? "block" : "none";

  if (isLegalPanelOpen) {
    document.addEventListener("click", handleOutsideClick);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const panel = document.getElementById("legalPanel");
  const tab = document.getElementById("legalTab");
  if (!panel.contains(event.target) && !tab.contains(event.target)) {
    panel.style.display = "none";
    isLegalPanelOpen = false;
    document.removeEventListener("click", handleOutsideClick);
  }
}

function closeLegalPanel() {
  const panel = document.getElementById("legalPanel");
  panel.style.display = "none";
  isLegalPanelOpen = false;
  document.removeEventListener("click", handleOutsideClick);
}

const panel = document.getElementById("legalPanel");
const handle = panel.querySelector(".resize-handle");

let isResizing = false;

handle.addEventListener("mousedown", (e) => {
  isResizing = true;
  document.body.style.cursor = "ew-resize";
  document.addEventListener("mousemove", resizePanel);
  document.addEventListener("mouseup", stopResizing);
  e.preventDefault(); // Prevent text selection
});

function resizePanel(e) {
  if (!isResizing) return;

  const newWidth = window.innerWidth - e.clientX;
  const minWidth = 250;
  const maxWidth = window.innerWidth * 0.9;

  if (newWidth >= minWidth && newWidth <= maxWidth) {
    panel.style.width = `${newWidth}px`;
  }
}

function stopResizing() {
  isResizing = false;
  document.body.style.cursor = "";
  document.removeEventListener("mousemove", resizePanel);
  document.removeEventListener("mouseup", stopResizing);
}
