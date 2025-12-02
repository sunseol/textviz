import { useCallback } from 'react';
import { toPng, toSvg } from 'html-to-image';

export function useExportImage() {
  const downloadImage = useCallback(async (elementId: string, filename: string, format: 'png' | 'svg' = 'png') => {
    const node = document.getElementById(elementId);
    if (!node) {
      console.error(`Element with id '${elementId}' not found`);
      return;
    }

    try {
      let dataUrl;
      const options = { cacheBust: true, backgroundColor: '#ffffff' }; // Ensure white background

      if (format === 'svg') {
        dataUrl = await toSvg(node, options);
      } else {
        dataUrl = await toPng(node, options);
      }

      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  }, []);

  return { downloadImage };
}
