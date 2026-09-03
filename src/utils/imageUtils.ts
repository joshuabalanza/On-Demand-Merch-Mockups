// Utility functions for client-side logo processing and 300 DPI export generation

/**
 * Removes white or near-white background from a logo image
 */
export async function removeWhiteBackground(dataUrl: string, tolerance = 25): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If color is close to white within tolerance
        if (r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance) {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Tints a logo to monochrome white, black, or custom color while preserving alpha
 */
export async function tintLogoImage(dataUrl: string, hexColor: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Source-in fill with hexColor
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Generates an ultra-high-resolution 300 DPI print-ready PNG of the isolated logo
 * scaled to physical inches (e.g. 12" x 14" @ 300 DPI = 3600 x 4200 px)
 */
export async function generatePrintReadyArtwork(
  logoDataUrl: string,
  widthInches: number,
  heightInches: number,
  dpi = 300
): Promise<{ dataUrl: string; pixelWidth: number; pixelHeight: number }> {
  const pixelWidth = Math.round(widthInches * dpi);
  const pixelHeight = Math.round(heightInches * dpi);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataUrl: logoDataUrl, pixelWidth, pixelHeight });
        return;
      }

      // Fill transparent background
      ctx.clearRect(0, 0, pixelWidth, pixelHeight);

      // Calculate aspect ratio fit within print box
      const scale = Math.min(pixelWidth / img.width, pixelHeight / img.height) * 0.9;
      const targetW = img.width * scale;
      const targetH = img.height * scale;
      const posX = (pixelWidth - targetW) / 2;
      const posY = (pixelHeight - targetH) / 2;

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, posX, posY, targetW, targetH);

      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        pixelWidth,
        pixelHeight,
      });
    };
    img.onerror = () => resolve({ dataUrl: logoDataUrl, pixelWidth, pixelHeight });
    img.src = logoDataUrl;
  });
}

/**
 * Generates a full production Tech Pack / Specification Sheet with crop marks,
 * product dimensions, Pantone notes, print method, and placement coordinates.
 */
export async function generateProductionSpecSheet(
  productName: string,
  garmentColorName: string,
  garmentColorHex: string,
  placementName: string,
  widthInches: number,
  heightInches: number,
  technique: string,
  mockupCanvasElement: HTMLElement | null,
  logoDataUrl: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  // High-res spec sheet: 2400 x 3200 px (8" x 10.6" @ 300 DPI)
  canvas.width = 2400;
  canvas.height = 3200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border & Header Bar
  ctx.fillStyle = '#09090b';
  ctx.fillRect(80, 80, canvas.width - 160, 140);

  // Header Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText('MERCH PRODUCTION TECH PACK & SPEC SHEET', 130, 170);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'normal 26px monospace';
  ctx.fillText(`SPEC-ID: ${Math.random().toString(36).substring(2, 9).toUpperCase()} | STANDARD: 300 DPI | COLOR SPACE: CMYK / sRGB`, 130, 205);

  // Left column: Product & Order Details
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('1. GARMENT SPECIFICATIONS', 100, 310);

  const drawField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = '#71717a';
    ctx.font = '600 24px sans-serif';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(value, x, y + 36);
  };

  drawField('Product Model', productName, 100, 370);
  drawField('Garment Color', `${garmentColorName} (${garmentColorHex})`, 100, 480);
  drawField('Print Placement', placementName, 100, 590);
  drawField('Print Technique', technique.toUpperCase(), 100, 700);
  drawField('Dimensions (W × H)', `${widthInches}" × ${heightInches}" (${Math.round(widthInches * 300)} × ${Math.round(heightInches * 300)} px)`, 100, 810);
  drawField('Bleed / Safe Margin', '0.125" / 0.25" Safe Inner Edge', 100, 920);

  // Garment Color Swatch Box
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 4;
  ctx.fillStyle = garmentColorHex;
  ctx.beginPath();
  ctx.roundRect(100, 1000, 180, 100, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#52525b';
  ctx.font = '22px sans-serif';
  ctx.fillText('Garment Swatch', 300, 1055);

  // Right Column: Mockup Visual Preview Box
  ctx.fillStyle = '#f4f4f5';
  ctx.fillRect(800, 270, 1500, 1500);
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 3;
  ctx.strokeRect(800, 270, 1500, 1500);

  // Render SVG or Image if available
  if (mockupCanvasElement) {
    const svgString = new XMLSerializer().serializeToString(mockupCanvasElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    await new Promise((res) => {
      const pImg = new Image();
      pImg.onload = () => {
        ctx.drawImage(pImg, 850, 320, 1400, 1400);
        URL.revokeObjectURL(blobURL);
        res(null);
      };
      pImg.onerror = () => {
        URL.revokeObjectURL(blobURL);
        res(null);
      };
      pImg.src = blobURL;
    });
  }

  // Section 2: Isolated Print-Ready Artwork box
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('2. PRINT-READY GRAPHIC DETAIL (300 DPI RASTER)', 100, 1860);

  // Grid pattern for transparent preview
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(100, 1910, 2200, 900);
  ctx.strokeStyle = '#e4e4e7';
  ctx.strokeRect(100, 1910, 2200, 900);

  // Draw crop marks around the artwork area
  const cx1 = 120;
  const cy1 = 1930;
  const cx2 = 2280;
  const cy2 = 2790;
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 2;
  // Top-left crop mark
  ctx.beginPath();
  ctx.moveTo(cx1 - 20, cy1); ctx.lineTo(cx1 + 40, cy1);
  ctx.moveTo(cx1, cy1 - 20); ctx.lineTo(cx1, cy1 + 40);
  // Top-right crop mark
  ctx.moveTo(cx2 - 40, cy1); ctx.lineTo(cx2 + 20, cy1);
  ctx.moveTo(cx2, cy1 - 20); ctx.lineTo(cx2, cy1 + 40);
  // Bottom-left crop mark
  ctx.moveTo(cx1 - 20, cy2); ctx.lineTo(cx1 + 40, cy2);
  ctx.moveTo(cx1, cy2 - 40); ctx.lineTo(cx1, cy2 + 20);
  // Bottom-right crop mark
  ctx.moveTo(cx2 - 40, cy2); ctx.lineTo(cx2 + 20, cy2);
  ctx.moveTo(cx2, cy2 - 40); ctx.lineTo(cx2, cy2 + 20);
  ctx.stroke();

  // Draw the logo in the artwork box
  await new Promise((res) => {
    const lImg = new Image();
    lImg.onload = () => {
      const maxW = 1200;
      const maxH = 750;
      const scale = Math.min(maxW / lImg.width, maxH / lImg.height);
      const drawW = lImg.width * scale;
      const drawH = lImg.height * scale;
      const dx = 100 + (2200 - drawW) / 2;
      const dy = 1910 + (900 - drawH) / 2;

      ctx.drawImage(lImg, dx, dy, drawW, drawH);
      res(null);
    };
    lImg.onerror = () => res(null);
    lImg.src = logoDataUrl;
  });

  // Footer QA Sign-Off
  ctx.fillStyle = '#71717a';
  ctx.font = '22px sans-serif';
  ctx.fillText('QA Approval: ___________________     Operator Initials: _________     Date: ________________', 100, 2900);
  ctx.fillText('Standard DTG/Screenprint calibration: Pre-treat dark garments, flash cure 320°F (160°C) for 60s.', 100, 2950);

  return canvas.toDataURL('image/png');
}
