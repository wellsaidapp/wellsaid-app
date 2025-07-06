import { jsPDF } from 'jspdf';
import { USER } from '../../../constants/user';
import logo from '../../../assets/wellsaid.svg';

// Convert inches to points (72 points per inch)
const inchToPt = (inches) => inches * 72;

// Helper function to convert image to black and white
async function convertToBlackAndWhite(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Draw white background first to preserve transparency
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
      }
      ctx.putImageData(imageData, 0, 0);

      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = () => resolve(imageSrc); // Fallback to original if conversion fails
    img.src = imageSrc;
  });
}

async function cropImageToCircle(imageSrc, size, isBlackAndWhite = false) {
  const scaleFactor = 2;
  const canvas = document.createElement('canvas');
  canvas.width = size * scaleFactor;
  canvas.height = size * scaleFactor;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to black and white if needed
        let result = canvas.toDataURL('image/png');
        if (isBlackAndWhite) {
          result = await convertToBlackAndWhite(result);
        }
        resolve(result);
      } catch (e) {
        console.error('Canvas cropping failed:', e);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

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

// Helper function to convert SVG to base64 (preserving color)
const convertSvgToBase64 = async (svgUrl, isBlackAndWhite = false) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let result = canvas.toDataURL('image/png');
      if (isBlackAndWhite) {
        result = await convertToBlackAndWhite(result);
      }
      resolve(result);
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
};

// Main export - generates the book PDF
export const generateBookPDF = async (
  newBook,
  entryOrder,
  insights,
  fontStyle = 'serif',
  isBlackAndWhite = false
) => {
  const doc = new jsPDF({
    unit: 'pt',
    format: [inchToPt(5), inchToPt(5)]
  });

  const margin = inchToPt(0.5);
  const contentWidth = inchToPt(4);
  const contentHeight = inchToPt(4);

  // Convert logo to base64 (with B&W if needed)
  let logoBase64 = null;
  try {
    logoBase64 = await convertSvgToBase64(logo, newBook.isBlackAndWhite);
  } catch (error) {
    console.warn('Could not convert logo:', error);
  }

  // Process cover image if exists (convert to B&W if needed)
  let processedCoverImage = newBook.coverImage;
  if (newBook.coverImage && newBook.isBlackAndWhite) {
    try {
      processedCoverImage = await convertToBlackAndWhite(newBook.coverImage);
    } catch (error) {
      console.warn('Could not convert cover image:', error);
    }
  }

  const orderedEntries = entryOrder.map(id => insights.find(e => e.id === id)).filter(Boolean);
  const previewPages = [
    { type: 'cover' },
    ...orderedEntries.flatMap(entry => ([
      { type: 'prompt', entry },
      { type: 'response', entry }
    ])),
    { type: 'backCover' }
  ];

  for (let pageIndex = 0; pageIndex < previewPages.length; pageIndex++) {
    const page = previewPages[pageIndex];
    if (pageIndex > 0) doc.addPage([inchToPt(5), inchToPt(5)]);

    switch (page.type) {
      case 'cover':
        renderCoverPage(doc, { ...newBook, coverImage: processedCoverImage }, margin, contentWidth, contentHeight);
        break;
      case 'prompt':
        renderPromptPage(doc, page.entry, margin, contentWidth, contentHeight, newBook.fontStyle);
        break;
      case 'response':
        renderResponsePage(doc, page.entry, margin, contentWidth, contentHeight, newBook.fontStyle);
        break;
      case 'backCover':
        await renderBackCoverPage(
          doc,
          newBook.backCoverNote,
          margin,
          contentWidth,
          contentHeight,
          newBook.fontStyle,
          USER,
          logoBase64,
          newBook.isBlackAndWhite
        );
        break;
    }

    if (page.type !== 'cover' && page.type !== 'backCover') {
      addPageNumber(doc, pageIndex, previewPages.length, margin);
    }
  }

  const pdfBase64 = doc.output('datauristring'); // or 'dataurlstring'
  console.log('📄 Base64 PDF Preview:', pdfBase64);
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


const renderBackCoverPage = async (
  doc,
  backCoverNote,
  margin,
  contentWidth,
  contentHeight,
  fontStyle,
  USER,
  logoBase64,
  isBlackAndWhite = false
) => {
  if (!backCoverNote) return;

  const renderAvatar = (doc, avatarBase64, centerX, avatarY, avatarSize) => {
    const avatarX = centerX - avatarSize / 2;
    doc.saveGraphicsState();
    doc.circle(centerX, avatarY + avatarSize / 2, avatarSize / 2);
    doc.clip();
    doc.addImage(avatarBase64, 'JPEG', avatarX, avatarY, avatarSize, avatarSize);
    doc.restoreGraphicsState();
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.circle(centerX, avatarY + avatarSize / 2, avatarSize / 2, 'S');
  };

  const centerX = margin + (contentWidth / 2);
  const avatarSize = 40;
  const userInfoSpacing = 8;
  const logoMaxHeight = 20;
  const logoSpacing = 15;
  const bottomPadding = 10;
  const noteToUserSpacing = 20;
  const availableHeight = contentHeight - (noteToUserSpacing + avatarSize + userInfoSpacing + 12 + logoSpacing + logoMaxHeight + bottomPadding) - 20;

  // Render back cover note
  doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'italic');
  const { fontSize, lineHeight, lines } = calculateOptimalTextLayout(
    doc,
    backCoverNote,
    contentWidth * 0.8,
    availableHeight,
    11
  );
  doc.setFontSize(fontSize);

  const totalTextHeight = lines.length * lineHeight;
  const textStartY = margin + 20 + (availableHeight - totalTextHeight) / 2;

  lines.forEach((line, i) => {
    doc.text(line, centerX, textStartY + (i * lineHeight), { align: 'center' });
  });

  const noteEndY = textStartY + totalTextHeight;
  const userInfoY = noteEndY + noteToUserSpacing;
  const nameY = userInfoY + avatarSize + userInfoSpacing;
  const adjustedNameY = nameY + 4;
  const logoY = margin + contentHeight - logoMaxHeight - bottomPadding;

  if (logoBase64) {
    try {
      const imgProps = doc.getImageProperties(logoBase64);
      const aspectRatio = imgProps.width / imgProps.height;
      let logoWidth, logoHeight;

      if (aspectRatio > 1) {
        logoWidth = logoMaxHeight * aspectRatio;
        logoHeight = logoMaxHeight;
      } else {
        logoWidth = logoMaxHeight;
        logoHeight = logoMaxHeight / aspectRatio;
      }

      doc.addImage(
        logoBase64,
        'PNG',
        centerX - (logoWidth / 2),
        logoY - (logoHeight / 2),
        logoWidth,
        logoHeight
      );
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  if (USER && USER.name) {
    doc.setFont(fontStyle === 'serif' ? 'times' : 'helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(USER.name || 'Anonymous', centerX, adjustedNameY, { align: 'center' });
  }

  if (USER && USER.avatarImage) {
    try {
      // Process avatar image (convert to B&W if needed)
      let processedAvatar = USER.avatarImage;
      if (isBlackAndWhite) {
        processedAvatar = await convertToBlackAndWhite(USER.avatarImage);
      }

      const circularAvatar = await cropImageToCircle(processedAvatar, avatarSize, isBlackAndWhite);
      const avatarX = centerX - (avatarSize / 2);
      const avatarY = userInfoY;

      doc.addImage(
        circularAvatar,
        'JPEG',
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
      );

      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.circle(centerX, avatarY + (avatarSize / 2), avatarSize / 2, 'S');
    } catch (error) {
      console.error('Avatar failed to process:', error);
    }
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
  renderCenteredText,
  convertSvgToBase64
};
