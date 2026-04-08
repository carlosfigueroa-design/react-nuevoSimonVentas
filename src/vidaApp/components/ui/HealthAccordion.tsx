/**
 * Acordeón colapsable para preguntas de salud por categoría.
 * Botones segmentados SÍ/NO (sin toggle).
 * Verde para NO, Amarillo Bolívar para SÍ, estado neutro inicial.
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
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
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
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {cat.name}
                <span className="text-xs text-gray-400">
                  ({answeredCount}/{totalRequired})
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isOpen && (
              <div className="space-y-3 px-4 pb-4">
                {cat.questions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-1.5">
                    <span className="text-xs text-gray-700">
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
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#005931] focus:outline-none focus:ring-1 focus:ring-[#005931]/15 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <textarea
                        id={`q-${q.id}`}
                        rows={2}
                        value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
                        onChange={(e) => onAnswerChange(q.id, e.target.value)}
                        disabled={disabled}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#005931] focus:outline-none focus:ring-1 focus:ring-[#005931]/15 disabled:bg-gray-100 disabled:cursor-not-allowed"
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


/** Componente de decisión binaria SÍ/NO — Selección unificada con Verde Corporativo */
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
        className={`rounded-l-lg px-5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
          value === true
            ? 'bg-[#005931] text-white shadow-sm'
            : 'border border-r-0 border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
        className={`rounded-r-lg px-5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
          value === false
            ? 'bg-[#005931] text-white shadow-sm'
            : 'border border-l-0 border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        NO
      </button>
    </div>
  );
}
