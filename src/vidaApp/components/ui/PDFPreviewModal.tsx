/**
 * Modal con vista previa del PDF de cotización.
 * Focus trap para accesibilidad.
 * Usa sb-ui-button, sb-ui-card del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, AlertCircle, RefreshCw } from 'lucide-react';

export interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteNumber: string;
  onGeneratePDF: () => Promise<Blob | null>;
}

export function PDFPreviewModal({
  isOpen,
  onClose,
  quoteNumber,
  onGeneratePDF,
}: PDFPreviewModalProps): React.JSX.Element | null {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await onGeneratePDF();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        setError('No se pudo generar el PDF. Intente nuevamente.');
      }
    } catch {
      setError('Error al generar el PDF. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [onGeneratePDF]);

  useEffect(() => {
    if (isOpen) {
      generate();
    }
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    window.print();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
            className="sb-ui-card sb-ui-card--elevated relative z-10 mx-4 w-full max-w-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 id="pdf-modal-title" className="sb-ui-heading-h6 font-semibold text-gray-900">
                Vista Previa — {quoteNumber}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 min-h-[300px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
              {loading && (
                <div className="sb-ui-spinner sb-ui-spinner--integrated">
                  <span className="sb-ui-spinner__label">Generando PDF...</span>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                  <p className="sb-ui-text-body text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={generate}
                    className="sb-ui-button sb-ui-button--secondary sb-ui-button--small sb-ui-button--icon-left"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reintentar
                  </button>
                </div>
              )}
              {!loading && !error && pdfUrl && (
                <p className="sb-ui-text-body text-gray-500">
                  Documento de cotización {quoteNumber} listo para descarga.
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="sb-ui-button sb-ui-button--secondary"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!!error || loading}
                className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill sb-ui-button--icon-left ${
                  (!!error || loading) ? 'sb-ui-button--disabled' : ''
                }`}
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
