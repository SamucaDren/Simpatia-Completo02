document.addEventListener("DOMContentLoaded", function () {
  const typeSelect = document.getElementById("typeSelect");
  const alternativasBox = document.getElementById("alternativasBox");

  if (typeSelect && alternativasBox) {
    function toggleAlternativas() {
      const v = (typeSelect.value || "").toString().toLowerCase().trim();
      if (v === "descritiva") {
        alternativasBox.style.display = "none";
      } else {
        alternativasBox.style.display = "block";
      }
    }

    toggleAlternativas();
    typeSelect.addEventListener("change", toggleAlternativas);
  }
});
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  pdf.setFont("Times", "Normal");
  pdf.setFontSize(12);

  const pageWidth = 210;
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  let y = 25;

  const lineHeight = 5;
  const spacing = 3;

  const questions = document.querySelectorAll(".question-card");

  function addHeader() {
    pdf.setFontSize(14);
    pdf.setFont("Times", "Bold");
    pdf.text("PROVA", pageWidth / 2, 15, { align: "center" });

    pdf.setFontSize(12);
    pdf.setFont("Times", "Normal");
    pdf.text(
      "Nome: __________________________________________________",
      margin,
      26,
    );
    pdf.text("Data: ____/____/______", pageWidth - margin - 50, 26);

    y = 40;
  }

  addHeader();

  questions.forEach((q) => {
    const titulo = q.querySelector("h3");
    const qText = titulo ? titulo.innerText.trim() : "";

    const typeElem = q.querySelector(".inline-block");
    const type = typeElem ? typeElem.innerText.trim().toLowerCase() : "";

    const qLines = pdf.splitTextToSize(qText, maxWidth);

    if (y + qLines.length * lineHeight > 280) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(qLines, margin, y);
    y += qLines.length * lineHeight + spacing;

    // MÚLTIPLA ESCOLHA
    if (type.includes("múltipla") || type.includes("mista")) {
      const options = q.querySelectorAll(".flex.items-center");

      options.forEach((opt, i) => {
        const letra = String.fromCharCode(65 + i);
        const textoElem = opt.querySelector("span:nth-child(2)");
        if (!textoElem) return;

        const texto = textoElem.innerText.trim();
        const lines = pdf.splitTextToSize(`${letra}) ${texto}`, maxWidth - 5);

        if (y + lines.length * lineHeight > 280) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(lines, margin + 5, y);
        y += lines.length * lineHeight;
      });

      y += spacing;
    }

    // DESCRITIVA
    if (type.includes("descritiva") || type.includes("mista")) {
      if (y + 20 > 280) {
        pdf.addPage();
        y = 20;
      }

      y += 8;
    }
    y += spacing;
  });

  pdf.save("prova.pdf");
}

function exportGIFT() {
  let giftText = "";

  const questions = document.querySelectorAll(".question-card");

  questions.forEach((q, index) => {
    const titulo = q.querySelector("h3");
    const qText = titulo ? titulo.innerText.trim() : "";

    const typeElem = q.querySelector(".inline-block");
    const type = typeElem ? typeElem.innerText.trim().toLowerCase() : "";

    // QUESTÕES DE MÚLTIPLA ESCOLHA
    if (type.includes("múltipla") || type.includes("mista")) {
      giftText += `::Q${index + 1}:: ${qText} {\n`;

      const options = q.querySelectorAll(".flex.items-center");

      options.forEach((opt) => {
        const textoElem = opt.querySelector("span:nth-child(2)");

        if (!textoElem) return;

        const texto = textoElem.innerText.trim();

        const isCorrect = opt.classList.contains("bg-blue-100");

        giftText += isCorrect ? `=${texto}\n` : `~${texto}\n`;
      });

      giftText += "}\n\n";
    }

    // QUESTÕES DESCRITIVAS
    else {
      giftText += `::Q${index + 1}:: ${qText} {}\n\n`;
    }
  });

  const blob = new Blob([giftText], { type: "text/plain;charset=utf-8" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "questoes.gift";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleChat() {
  const win = document.getElementById("chat-window");
  win.style.display = win.style.display === "none" ? "flex" : "none";
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const content = document.getElementById("chat-content");

  const message = input.value.trim();
  if (!message) return;

  content.innerHTML += `<p style="margin-bottom:10px;"><b>Você:</b> ${message}</p>`;
  input.value = "";

  const response = await fetch("/api/gerador-questoes-objetivas/chat/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  });

  //const data = await response.json();

  const text = await response.text();
  console.log(text);
  content.innerHTML += `<p style="margin-bottom:10px; color:#444a52;"><b>IA:</b> ${data.response}</p>`;
  content.scrollTop = content.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("generateBtn");

  if (btn) {
    btn.addEventListener("click", async function () {
      console.log("Botão clicado");

      const theme = document.getElementById("theme").value;
      const subject = document.getElementById("subject").value;
      const type = document.getElementById("typeSelect").value;
      const quantity = document.getElementById("quantity").value;
      const difficulty = document.getElementById("difficulty").value;
      const alternatives = document.getElementById("alternatives").value;

      btn.disabled = true;
      btn.innerText = "Gerando...";

      try {
        const response = await fetch(
          "/api/gerador-questoes-objetivas/questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              theme,
              subject,
              type,
              quantity,
              difficulty,
              alternatives,
            }),
          },
        );

        const data = await response.json();

        console.log("Resposta da API:", data);

        let questions = data.questions || data.data || data;

        if (!Array.isArray(questions)) {
          questions = Object.values(questions || {});
        }

        console.log("Questions:", questions);

        renderQuestions(questions);
        document.getElementById("exportButtons").classList.remove("hidden");
      } catch (err) {
        alert("Erro ao gerar questões: " + err.message);
      }

      btn.disabled = false;
      btn.innerText = "Gerar Questões";
    });
  }
});

function renderQuestions(questions) {
  const container = document.getElementById("questionsContainer");
  const empty = document.getElementById("emptyState");
  const resultsSection = document.getElementById("resultsSection");

  container.innerHTML = "";

  document.getElementById("qtdQuestoes").innerText = questions.length;

  if (!questions || questions.length === 0) {
    empty.style.display = "block";
    resultsSection.classList.add("hidden");
    return;
  }

  empty.style.display = "none";
  resultsSection.classList.remove("hidden");

  questions.forEach((q, index) => {
    const typeLabel =
      q.type === "mc"
        ? "Múltipla Escolha"
        : q.type === "descriptive"
          ? "Descritiva"
          : "Mista";

    let badgeColor = "#006FFF";
    let optionsHTML = "";

    if (q.options && Array.isArray(q.options)) {
      q.options.forEach((opt, i) => {
        const letra = String.fromCharCode(65 + i);
        const isCorrect = q.correctIndex === i;

        optionsHTML += `
                    <div class="border rounded-md px-3 py-2 mb-2 flex items-center
                        ${isCorrect ? "bg-blue-100 border-blue-300" : "bg-white"}">

                        <span class="font-semibold text-gray-500 mr-2">
                            ${letra})
                        </span>

                        <span class="text-gray-700">
                            ${opt}
                        </span>
                    </div>
                `;
      });
    }

    const card = document.createElement("div");
    card.className =
      "question-card bg-white border rounded-lg shadow-sm p-6 space-y-4";

    card.innerHTML = `
            <div class="inline-block px-3 py-1 text-white text-xs rounded-md mb-3"
                 style="background:${badgeColor}">
                ${typeLabel}
            </div>

            <h3 class="text-[17px] text-[#4C4B67] font-medium">
                ${index + 1}. ${q.text}
            </h3>

            <div>${optionsHTML}</div>

            <div class="mt-3 text-sm text-gray-600 border-t pt-3">
                <strong>Explicação:</strong> ${q.explanation || ""}
            </div>
        `;

    container.appendChild(card);
  });
}
