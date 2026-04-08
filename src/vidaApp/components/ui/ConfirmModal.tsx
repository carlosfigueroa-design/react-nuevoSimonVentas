/**
 * Modal de confirmación con animación Framer Motion.
 * Soporta variante de advertencia (extraprima).
 * Se renderiza como portal en document.body.
 * Botones usan sb-ui-button del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Variante visual: 'default' o 'warning' (borde amarillo, icono de alerta) */
  variant?: 'default' | 'warning';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps): React.JSX.Element | null {
  const isWarning = variant === 'warning';

  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap: Escape to close + Tab cycling within modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
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
  }, [isOpen, onCancel]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl ${
              isWarning ? 'border-2 border-[#FFD100]' : ''
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              {isWarning && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD100]/20">
                  <AlertTriangle className="h-5 w-5 text-[#FFD100]" />
                </div>
              )}
              <div>
                <h2 id="modal-title" className="text-h6 font-semibold text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="sb-ui-button sb-ui-button--secondary"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`sb-ui-button ${
                  isWarning
                    ? 'sb-ui-button--secondary sb-ui-button--fill'
                    : 'sb-ui-button--primary sb-ui-button--fill'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
