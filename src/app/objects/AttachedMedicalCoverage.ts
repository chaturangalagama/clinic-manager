class AttachedMedicalCoverage {
  medicalCoverageId: string;
  planId: string;
  coverageId?: string;

  constructor(medicalCoverageId?: string, planId?: string, coverageId?: string) {
    this.medicalCoverageId = medicalCoverageId || '';
    this.planId = planId || '';
    this.coverageId = coverageId || '';
  }
}

export { AttachedMedicalCoverage };
