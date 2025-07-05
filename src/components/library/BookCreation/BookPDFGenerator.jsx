import { jsPDF } from 'jspdf';

// Convert inches to points (72 points per inch)
const inchToPt = (inches) => inches * 72;

const addPageNumber = (doc, currentPage, totalPages, margin) => {
  doc.setFontSize(8);
  doc.text(
    `Page ${currentPage} of ${totalPages - 1}`,
    inchToPt(5) - margin,
    inchToPt(5) - margin + 5,
    { align: 'right' }
  );
};

// Main export - generates the book PDF
export const generateBookPDF = async (newBook, entryOrder, insights) => {
  const doc = new jsPDF({
    unit: 'pt',
    format: [inchToPt(5), inchToPt(5)]
  });

  const margin = inchToPt(0.25);
  const contentWidth = inchToPt(4.5);
  const contentHeight = inchToPt(4.5);

  const orderedEntries = entryOrder.map(id => insights.find(e => e.id === id)).filter(Boolean);
  const previewPages = [
    { type: 'cover' },
    ...orderedEntries.flatMap(entry => ([
      { type: 'prompt', entry },
      { type: 'response', entry }
    ])),
    { type: 'backCover' }
  ];

  previewPages.forEach((page, pageIndex) => {
    if (pageIndex > 0) doc.addPage([inchToPt(5), inchToPt(5)]);

    switch (page.type) {
      case 'cover':
        renderCoverPage(doc, newBook, margin, contentWidth, contentHeight);
        break;
      case 'prompt':
        renderPromptPage(doc, page.entry, margin, contentWidth, newBook.fontStyle);
        break;
      case 'response':
        renderResponsePage(doc, page.entry, margin, contentWidth, newBook.fontStyle);
        break;
      case 'backCover':
        renderBackCoverPage(doc, newBook.backCoverNote, margin, contentWidth, newBook.fontStyle);
        break;
    }

    if (page.type !== 'cover') {
      addPageNumber(doc, pageIndex, previewPages.length, margin);
    }
  });

  return doc.output('blob');
};

// Helper functions (can be used/tested independently if needed)
const renderCoverPage = (doc, newBook, margin, contentWidth, contentHeight) => {
  let imageBottom = margin; // Track where the image ends

  if (newBook.coverImage) {
    const imgProps = doc.getImageProperties(newBook.coverImage);
    const imgWidth = contentWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const yPos = margin + (contentHeight - Math.min(imgHeight, contentHeight)) / 2;
    const actualImageHeight = Math.min(imgHeight, contentHeight);

    doc.addImage(
      newBook.coverImage,
      'JPEG',
      margin,
      yPos,
      imgWidth,
      actualImageHeight
    );

    // Calculate where the image actually ends
    imageBottom = yPos + actualImageHeight;
  }

  // Title in top margin
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(newBook.title || 'Untitled Book', margin, margin - 5, {
    align: 'left',
    maxWidth: contentWidth
  });

  // Description in bottom-right whitespace
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  // Split text into lines that fit within contentWidth
  const descLines = doc.splitTextToSize(
    newBook.description || 'A collection of wisdom and insights',
    contentWidth
  );

  // Calculate available whitespace below the image
  const pageBottom = margin + contentHeight;
  const availableWhitespace = pageBottom - imageBottom;

  // Position description in the lower portion of the whitespace
  // Leave some padding from the image bottom and page bottom
  const padding = 10; // Adjust this value as needed
  const descY = Math.max(
    imageBottom + padding,
    pageBottom - (descLines.length * 10) - padding // 10 is approximate line height
  );

  // Draw text aligned to right within the content area
  doc.text(descLines, margin + contentWidth, descY, {
    align: 'right',
    maxWidth: contentWidth
  });
};

const renderPromptPage = (doc, entry, margin, contentWidth, fontStyle) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Prompt:', margin, margin + 15);

  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'normal');
  doc.setFontSize(10);
  const promptLines = doc.splitTextToSize(entry.prompt, contentWidth);
  doc.text(promptLines, margin, margin + 30);
};

const renderResponsePage = (doc, entry, margin, contentWidth, fontStyle) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Response:', margin, margin + 15);

  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'normal');
  doc.setFontSize(10);
  const content = entry.response || entry.content || '';
  const responseLines = doc.splitTextToSize(content, contentWidth);
  doc.text(responseLines, margin, margin + 30);
};

const renderBackCoverPage = (doc, backCoverNote, margin, contentWidth, fontStyle) => {
  if (!backCoverNote) return;

  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'italic');
  doc.setFontSize(10);
  const backCoverLines = doc.splitTextToSize(backCoverNote, contentWidth);

  // Calculate total text height (approx 12pt per line)
  const textHeight = backCoverLines.length * 12;

  // Center vertically and horizontally
  const centerX = inchToPt(5) / 2;
  const startY = (inchToPt(5) - textHeight) / 2;

  // Use doc.text with centered alignment
  backCoverLines.forEach((line, i) => {
    doc.text(line, centerX, startY + (i * 12), {
      align: 'center'
    });
  });
};

// Optional: Export helpers for testing if needed
export const __testables__ = {
  inchToPt,
  renderCoverPage,
  renderPromptPage,
  renderResponsePage,
  renderBackCoverPage,
  addPageNumber
};
