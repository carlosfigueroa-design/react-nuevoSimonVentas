/**
 * Acordeón colapsable para preguntas de salud por categoría.
 * Botones segmentados SÍ/NO (sin toggle).
 * Usa sb-ui-accordion del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HealthCategory } from '../../types';

export interface HealthAccordionProps {
  categories: HealthCategory[];
  answers: Record<string, string | boolean | number>;
  onAnswerChange: (questionId: string, value: string | boolean | number) => void;
  disabled?: boolean;
}

export function HealthAccordion({
  categories,
  answers,
  onAnswerChange,
  disabled = false,
}: HealthAccordionProps): React.JSX.Element {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="sb-ui-accordion sb-ui-accordion--secondary">
      {categories.map((cat) => {
        const isOpen = openSections.has(cat.id);
        const answeredCount = cat.questions.filter(
          (q) => q.type === 'boolean' && answers[q.id] !== undefined,
        ).length;
        const totalRequired = cat.questions.filter(
          (q) => q.type === 'boolean' && q.required,
        ).length;

        return (
          <div key={cat.id}>
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              aria-expanded={isOpen}
              className="sb-ui-accordion__header"
            >
              <span className="sb-ui-accordion__label">
                {cat.name}
                <span className="sb-ui-text-caption text-gray-400 ml-2">
                  ({answeredCount}/{totalRequired})
                </span>
              </span>
              <ChevronDown
                className={`sb-ui-accordion__icon-end h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isOpen && (
              <div className="sb-ui-accordion__content space-y-3 px-4 pb-4">
                {cat.questions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-1.5">
                    <span className="sb-ui-text-caption text-gray-700">
                      {q.text}
                      {q.required && <span className="ml-0.5 text-red-500">*</span>}
                    </span>

                    {q.type === 'boolean' ? (
                      <BinarySelector
                        questionId={q.id}
                        questionText={q.text}
                        value={answers[q.id] as boolean | undefined}
                        onChange={(val) => onAnswerChange(q.id, val)}
                        disabled={disabled}
                      />
                    ) : q.type === 'number' ? (
                      <input
                        id={`q-${q.id}`}
                        type="number"
                        value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
                        onChange={(e) => onAnswerChange(q.id, Number(e.target.value))}
                        disabled={disabled}
                        className={`sb-ui-input sb-ui-input--small ${disabled ? 'sb-ui-input--disabled' : ''}`}
                      />
                    ) : (
                      <textarea
                        id={`q-${q.id}`}
                        rows={2}
                        value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
                        onChange={(e) => onAnswerChange(q.id, e.target.value)}
                        disabled={disabled}
                        className={`sb-ui-textarea sb-ui-textarea--small ${disabled ? 'sb-ui-textarea--loading' : ''}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


/** Componente de decisión binaria SÍ/NO — Usa sb-ui-button del DS */
function BinarySelector({
  questionId,
  questionText,
  value,
  onChange,
  disabled,
}: {
  questionId: string;
  questionText: string;
  value: boolean | undefined;
  onChange: (val: boolean) => void;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <div className="inline-flex" role="radiogroup" aria-label={questionText}>
      <button
        type="button"
        role="radio"
        aria-checked={value === true}
        aria-label={`${questionText} — SÍ`}
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`sb-ui-button sb-ui-button--small ${
          value === true
            ? 'sb-ui-button--primary sb-ui-button--fill'
            : 'sb-ui-button--secondary'
        } ${disabled ? 'sb-ui-button--disabled' : ''}`}
        style={{ borderRadius: '8px 0 0 8px' }}
      >
        SÍ
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === false}
        aria-label={`${questionText} — NO`}
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`sb-ui-button sb-ui-button--small ${
          value === false
            ? 'sb-ui-button--primary sb-ui-button--fill'
            : 'sb-ui-button--secondary'
        } ${disabled ? 'sb-ui-button--disabled' : ''}`}
        style={{ borderRadius: '0 8px 8px 0' }}
      >
        NO
      </button>
    </div>
  );
}
