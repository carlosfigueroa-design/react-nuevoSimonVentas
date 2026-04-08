/**
 * Modal de envío de correo pre-llenado con email del Tomador.
 * Botones usan sb-ui-button, inputs usan sb-ui-input del DS.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { sendQuoteEmail } from '../../services';

export interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteNumber: string;
  defaultEmail: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function EmailModal({
  isOpen,
  onClose,
  quoteNumber,
  defaultEmail,
}: EmailModalProps): React.JSX.Element | null {
  const [email, setEmail] = useState(defaultEmail);
  const [status, setStatus] = useState<Status>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
      setStatus('idle');
    }
  }, [isOpen, defaultEmail]);

  // Focus trap: Escape to close + Tab cycling within modal
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

  const handleSend = async () => {
    setStatus('sending');
    try {
      const result = await sendQuoteEmail(quoteNumber, email);
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
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
            aria-labelledby="email-modal-title"
            className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 id="email-modal-title" className="text-h6 font-semibold text-gray-900">
                Enviar Cotización
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle className="h-10 w-10 text-[#00C875]" />
                <p className="text-sm font-medium text-gray-900">Cotización enviada exitosamente</p>
                <p className="text-xs text-gray-500">Se envió a {email}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="sb-ui-button sb-ui-button--primary sb-ui-button--fill mt-2"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    Cotización <span className="font-medium">{quoteNumber}</span>
                  </p>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email-input" className="text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="sb-ui-input w-full"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="sb-ui-alert sb-ui-alert--error sb-ui-alert--small">
                      <AlertCircle className="sb-ui-alert__icon h-4 w-4 shrink-0" />
                      <span className="sb-ui-alert__message">Error al enviar. Intente nuevamente.</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="sb-ui-button sb-ui-button--secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!email.trim() || status === 'sending'}
                    className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill ${
                      (!email.trim() || status === 'sending') ? 'sb-ui-button--disabled' : ''
                    }`}
                  >
                    {status === 'error' ? (
                      <><RefreshCw className="h-4 w-4 mr-1.5 inline" /> Reintentar</>
                    ) : (
                      <><Send className="h-4 w-4 mr-1.5 inline" /> {status === 'sending' ? 'Enviando...' : 'Enviar'}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
