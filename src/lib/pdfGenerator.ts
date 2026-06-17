/**
 * Lazy PDF generator — dynamically imports @react-pdf/renderer
 * to keep it out of the main bundle.
 */

import { createElement } from 'react';

export async function generateResumePDF(): Promise<Blob> {
  const [{ pdf }, { default: ResumePDFDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/ResumePDF'),
  ]);

  return pdf(createElement(ResumePDFDocument)).toBlob();
}
