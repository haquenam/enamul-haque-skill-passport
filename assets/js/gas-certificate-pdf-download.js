/*
 * EHSP certificate PDF download for Google Apps Script certificate pages.
 * Only upgrades the existing "Print / Save One-page PDF" action.
 * Does not access examination or registry data and does not use network APIs
 * other than loading the two PDF-rendering libraries over HTTPS.
 */
(function () {
  'use strict';

  const NEW_LABEL = 'Download as PDF';
  const OLD_LABEL = /print\s*\/\s*save\s*one[\s-]*page\s*pdf/i;
  const RENDER_WIDTH = 1120;
  const LIBRARIES = [
    ['html2canvas', 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
      () => typeof window.html2canvas === 'function'],
    ['jsPDF', 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
      () => Boolean(window.jspdf && window.jspdf.jsPDF)]
  ];

  function labelOf(element) {
    return element.tagName === 'INPUT' ? element.value : (element.textContent || '');
  }

  function setLabel(element, label) {
    if (element.tagName === 'INPUT') element.value = label;
    else element.textContent = label;
  }

  function upgradeButtons() {
    document.querySelectorAll('button, a, input[type="button"]').forEach(element => {
      if (element.dataset.ehspDirectPdf === 'true' || !OLD_LABEL.test(labelOf(element))) return;
      element.dataset.ehspDirectPdf = 'true';
      setLabel(element, NEW_LABEL);
    });
  }

  function containsCertificate(element) {
    const text = element.textContent || '';
    return /Certificate of Achievement/i.test(text) && /Certificate ID/i.test(text);
  }

  function getCertificate() {
    const selectors = [
      '#certificateCanvas', '#certificate', '#certificateCard',
      '.certificate', '.certificate-card', '.certificate-sheet',
      '.certificate-container', '[data-certificate]'
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && containsCertificate(element)) return element;
    }
    const heading = Array.from(document.querySelectorAll('h1, h2, h3'))
      .find(element => /Certificate of Achievement/i.test(element.textContent || ''));
    if (heading) {
      let element = heading.parentElement;
      while (element && element !== document.body) {
        if (containsCertificate(element) &&
          /Founder and Issuer|Recognition Note|Verification/i.test(element.textContent || '') &&
          element.getBoundingClientRect().height >= 250) return element;
        element = element.parentElement;
      }
    }
    throw new Error('Could not identify the complete certificate on this page.');
  }

  function addScript(url, available) {
    if (available()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.src = url;
      element.async = true;
      element.onload = () => available() ? resolve() : reject(new Error('Library was not initialised.'));
      element.onerror = () => reject(new Error('Unable to load the PDF library.'));
      document.head.appendChild(element);
    });
  }

  function getPdfFileName(element) {
    const text = (element.textContent || '').replace(/\s+/g, '');
    const id = text.match(/EHSP-CSE[234]-[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}/i);
    return (id ? id[0].toUpperCase() : 'EHSP-Certificate') + '.pdf';
  }

  async function download(element) {
    await Promise.all(LIBRARIES.map(([, url, available]) => addScript(url, available)));
    const certificate = getCertificate();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(Array.from(certificate.querySelectorAll('img')).map(image => {
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }));

    certificate.setAttribute('data-ehsp-pdf-capture', 'yes');
    let canvas;
    try {
      canvas = await window.html2canvas(certificate, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        windowWidth: 1280,
        onclone: clonedDocument => {
          const clone = clonedDocument.querySelector('[data-ehsp-pdf-capture="yes"]');
          if (clone) {
            clone.style.width = RENDER_WIDTH + 'px';
            clone.style.maxWidth = 'none';
            clone.style.minWidth = RENDER_WIDTH + 'px';
            clone.style.margin = '0';
          }
          clonedDocument.body.style.minWidth = '1200px';
        }
      });
    } finally {
      certificate.removeAttribute('data-ehsp-pdf-capture');
    }

    const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const ratio = Math.min((pageWidth - 2 * margin) / canvas.width,
      (pageHeight - 2 * margin) / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG',
      (pageWidth - width) / 2, (pageHeight - height) / 2, width, height);
    pdf.save(getPdfFileName(certificate));
  }

  let busy = false;
  document.addEventListener('click', async event => {
    const button = event.target.closest &&
      event.target.closest('button, a, input[type="button"]');
    if (!button || button.dataset.ehspDirectPdf !== 'true') return;

    // Capture this event before legacy onclick/window.print() handlers execute.
    event.preventDefault();
    event.stopImmediatePropagation();
    if (busy) return;
    busy = true;
    button.setAttribute('aria-busy', 'true');
    if ('disabled' in button) button.disabled = true;
    setLabel(button, 'Preparing PDF...');
    try {
      await download(button);
    } catch (error) {
      console.error('EHSP certificate PDF download failed:', error);
      window.alert('Could not download the certificate PDF. Please refresh the page and try again.');
    } finally {
      busy = false;
      button.removeAttribute('aria-busy');
      if ('disabled' in button) button.disabled = false;
      setLabel(button, NEW_LABEL);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeButtons, { once: true });
  } else upgradeButtons();
  const observer = new MutationObserver(upgradeButtons);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
