export async function exportStudyPlanToPDF(studyPlan, discipline) {
  if (!studyPlan) return;

  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Função para remover emojis e caracteres especiais
    const cleanText = (text) => {
      return text
        .replace(/[^\x00-\x7F]/g, "") // Remove caracteres não-ASCII
        .replace(/\s+/g, " ") // Remove espaços múltiplos
        .trim();
    };

    // Função para adicionar nova página se necessário
    const checkNewPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Função para adicionar texto com quebra de linha
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(...color);

      const cleanedText = cleanText(text);
      const lines = doc.splitTextToSize(cleanedText, maxWidth);
      lines.forEach((line) => {
        checkNewPage();
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 3;
    };

    // Função para adicionar linha divisória
    const addDivider = () => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    };

    // Cabeçalho
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PLANO DE ESTUDO INTELIGENTE", pageWidth / 2, 20, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.text(studyPlan.discipline, pageWidth / 2, 32, { align: "center" });

    yPosition = 50;

    // Informações Gerais
    doc.setTextColor(0, 0, 0);
    addDivider();
    addText("INFORMACOES GERAIS", 16, true, [147, 51, 234]);
    addDivider();

    addText(`Nivel de Conhecimento: ${studyPlan.knowledgeLevel}`, 11);
    addText(`Horas Diarias: ${studyPlan.dailyHours}h`, 11);
    addText(`Dias Disponiveis: ${studyPlan.daysAvailable} dias`, 11);
    addText(`Duracao Total: ${studyPlan.totalDuration}`, 11);
    addText(`Intensidade: ${studyPlan.studyIntensity}`, 11);
    addText(`Objetivo: ${studyPlan.studyGoal}`, 11);
    addText(
      `Tipo de Estudo: ${studyPlan.hasDeadline ? "COM prazo definido" : "Estudo continuo"}`,
      11,
    );
    addText(`Probabilidade de Sucesso: ${studyPlan.successProbability}`, 11);

    yPosition += 5;

    // Análise de Viabilidade
    if (studyPlan.timeAssessment) {
      checkNewPage(40);
      addDivider();
      addText("ANALISE DE VIABILIDADE", 16, true, [220, 38, 38]);
      addDivider();
      addText(studyPlan.timeAssessment, 11);
      yPosition += 5;
    }

    // Módulos
    addDivider();
    addText(
      `MODULOS DE ESTUDO (${studyPlan.modules?.length || 0} modulos)`,
      16,
      true,
      [147, 51, 234],
    );
    addDivider();

    studyPlan.modules?.forEach((module, index) => {
      checkNewPage(60);

      addText(`MODULO ${index + 1}: ${module.title}`, 14, true, [37, 99, 235]);
      addText(
        `Duracao: ${module.duration} | Prioridade: ${module.priority} | Foco: ${module.focus}`,
        10,
      );
      yPosition += 3;

      // Tópicos
      addText("Topicos Essenciais:", 12, true);
      module.topics?.forEach((topic, idx) => {
        addText(`  ${idx + 1}. ${topic}`, 10);
      });
      yPosition += 3;

      // Aplicações Práticas
      if (
        module.practicalApplications &&
        module.practicalApplications.length > 0
      ) {
        addText("Aplicacoes Praticas:", 12, true);
        module.practicalApplications.forEach((app, idx) => {
          addText(`  ${idx + 1}. ${app}`, 10);
        });
        yPosition += 3;
      }

      // Cronograma
      if (module.dailySchedule) {
        addText(
          `Cronograma ${studyPlan.daysAvailable <= 3 ? "Diario" : "Semanal"}:`,
          12,
          true,
        );
        Object.entries(module.dailySchedule).forEach(([period, task]) => {
          addText(`  ${period}: ${task}`, 10);
        });
      }

      yPosition += 8;
    });

    // Metas
    if (studyPlan.goals && studyPlan.goals.length > 0) {
      checkNewPage(40);
      addDivider();
      addText("METAS REALISTAS", 16, true, [22, 163, 74]);
      addDivider();
      studyPlan.goals.forEach((goal, idx) => {
        addText(`${idx + 1}. ${goal}`, 11);
      });
      yPosition += 5;
    }

    // Recomendações
    if (studyPlan.recommendations && studyPlan.recommendations.length > 0) {
      checkNewPage(40);
      addDivider();
      addText("RECOMENDACOES", 16, true, [234, 179, 8]);
      addDivider();
      studyPlan.recommendations.forEach((rec, idx) => {
        addText(`${idx + 1}. ${rec}`, 11);
      });
    }

    // Rodapé
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Gerado em ${new Date().toLocaleDateString("pt-BR")} | Pagina ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      );
    }

    // Salvar PDF
    doc.save(
      `plano-estudo-${discipline.replace(/\s+/g, "-").toLowerCase()}.pdf`,
    );
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Tente novamente.");
  }
}
