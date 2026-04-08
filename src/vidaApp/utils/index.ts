// Utilities barrel file
export {
  validateEmail,
  validatePhone,
  validateDocument,
  validateRequiredFields,
  calculateAge,
  validateAge,
} from './validation';

export {
  calculatePrimaForCoverage,
  calculateTotalPrima,
} from './primaCalculation';

export { calculateBMI } from './bmiCalculation';

export {
  formatCurrency,
  formatDate,
  formatDocumentNumber,
  parseCurrency,
  formatCurrencyInput,
} from './formatters';

export { generateQuoteNumber } from './quoteNumberGenerator';
export { generateDeclaracionNumber } from './declaracionNumberGenerator';
export { generatePolicyNumber } from './policyNumberGenerator';
export { calculateExtraprima } from './extraprimaCalculation';
