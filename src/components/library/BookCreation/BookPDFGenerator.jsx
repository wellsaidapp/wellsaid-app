import { jsPDF } from 'jspdf';
import { USER } from '../../../constants/user';

// Convert inches to points (72 points per inch)
const inchToPt = (inches) => inches * 72;

const addPageNumber = (doc, currentPage, totalPages, margin) => {
  doc.setFontSize(8);
  const centerX = inchToPt(5) / 2; // Center of the 5" page
  doc.text(
    `Page ${currentPage} of ${totalPages - 1}`,
    centerX,
    inchToPt(5) - margin + 5,
    { align: 'center' }
  );
};

// Main export - generates the book PDF
export const generateBookPDF = async (newBook, entryOrder, insights) => {
  const doc = new jsPDF({
    unit: 'pt',
    format: [inchToPt(5), inchToPt(5)]
  });

  const margin = inchToPt(0.5); // Increased margin for better spacing
  const contentWidth = inchToPt(4); // Adjusted for new margin
  const contentHeight = inchToPt(4); // Adjusted for new margin

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
        renderPromptPage(doc, page.entry, margin, contentWidth, contentHeight, newBook.fontStyle);
        break;
      case 'response':
        renderResponsePage(doc, page.entry, margin, contentWidth, contentHeight, newBook.fontStyle);
        break;
      case 'backCover':
        renderBackCoverPage(doc, newBook.backCoverNote, margin, contentWidth, contentHeight, newBook.fontStyle, USER);
        break;
    }

    if (page.type !== 'cover' && page.type !== 'backCover') {
      addPageNumber(doc, pageIndex, previewPages.length, margin);
    }
  });

  return doc.output('blob');
};

// Helper function to calculate optimal font size and line height
const calculateOptimalTextLayout = (doc, text, maxWidth, maxHeight, baseFontSize = 12) => {
  let fontSize = baseFontSize;
  let lineHeight = fontSize * 1.4; // Better line spacing
  let lines = [];

  // Try decreasing font sizes until text fits
  while (fontSize >= 8) {
    doc.setFontSize(fontSize);
    lines = doc.splitTextToSize(text, maxWidth);
    const totalHeight = lines.length * lineHeight;

    if (totalHeight <= maxHeight) {
      break;
    }

    fontSize -= 0.5;
    lineHeight = fontSize * 1.4;
  }

  return { fontSize, lineHeight, lines };
};

// Helper function to render centered text block
const renderCenteredText = (doc, lines, lineHeight, contentWidth, contentHeight, margin, yOffset = 0) => {
  const totalTextHeight = lines.length * lineHeight;
  const centerX = margin + (contentWidth / 2);
  const startY = margin + (contentHeight - totalTextHeight) / 2 + yOffset;

  lines.forEach((line, i) => {
    doc.text(line, centerX, startY + (i * lineHeight), {
      align: 'center'
    });
  });
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

const renderPromptPage = (doc, entry, margin, contentWidth, contentHeight, fontStyle) => {
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const centerX = margin + (contentWidth / 2);
  doc.text('Prompt', centerX, margin + 25, { align: 'center' });

  // Decorative line under header
  const lineY = margin + 35;
  doc.setLineWidth(1);
  doc.line(margin + contentWidth * 0.25, lineY, margin + contentWidth * 0.75, lineY);

  // Calculate available space for content (excluding header area and page number area)
  const availableHeight = contentHeight - 60; // 60pt for header and bottom margin

  // Set font and calculate layout
  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'normal');
  const { fontSize, lineHeight, lines } = calculateOptimalTextLayout(
    doc,
    entry.prompt,
    contentWidth * 0.9, // Leave some padding on sides
    availableHeight,
    12
  );

  doc.setFontSize(fontSize);

  // Render centered text with offset to account for header
  renderCenteredText(doc, lines, lineHeight, contentWidth, availableHeight, margin, 50);
};

const renderResponsePage = (doc, entry, margin, contentWidth, contentHeight, fontStyle) => {
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const centerX = margin + (contentWidth / 2);
  doc.text('Response', centerX, margin + 25, { align: 'center' });

  // Decorative line under header
  const lineY = margin + 35;
  doc.setLineWidth(1);
  doc.line(margin + contentWidth * 0.25, lineY, margin + contentWidth * 0.75, lineY);

  // Calculate available space for content (excluding header area and page number area)
  const availableHeight = contentHeight - 60; // 60pt for header and bottom margin

  // Set font and calculate layout
  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'normal');
  const content = entry.response || entry.content || '';
  const { fontSize, lineHeight, lines } = calculateOptimalTextLayout(
    doc,
    content,
    contentWidth * 0.9, // Leave some padding on sides
    availableHeight,
    12
  );

  doc.setFontSize(fontSize);

  // Render centered text with offset to account for header
  renderCenteredText(doc, lines, lineHeight, contentWidth, availableHeight, margin, 50);
};

const renderBackCoverPage = (doc, backCoverNote, margin, contentWidth, contentHeight, fontStyle, USER) => {
  if (!backCoverNote) return;

  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'italic');

  // Calculate optimal layout for back cover
  const { fontSize, lineHeight, lines } = calculateOptimalTextLayout(
    doc,
    backCoverNote,
    contentWidth * 0.8, // More padding for back cover
    contentHeight - 80, // Leave more margin for user name at bottom
    11
  );

  doc.setFontSize(fontSize);

  // Render perfectly centered text
  renderCenteredText(doc, lines, lineHeight, contentWidth, contentHeight - 40, margin);

  // Add user name at bottom center if provided
  if (USER && USER.name) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const centerX = margin + (contentWidth / 2);
    const bottomY = margin + contentHeight - 15; // 15pt from bottom
    doc.text(USER.name, centerX, bottomY, { align: 'center' });
  }
};

// Optional: Export helpers for testing if needed
export const __testables__ = {
  inchToPt,
  renderCoverPage,
  renderPromptPage,
  renderResponsePage,
  renderBackCoverPage,
  addPageNumber,
  calculateOptimalTextLayout,
  renderCenteredText
};
