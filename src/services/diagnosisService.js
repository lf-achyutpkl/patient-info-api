import Diagnosis from '../models/diagnosis';

/**
 * Get all diagnosis.
 *
 * @return {Promise}
 */
export function getAllDiagnosis() {
  return Diagnosis.fetchAll();
}
