import { AttachedMedicalCoverage } from '../AttachedMedicalCoverage';

interface PatientVisitResponse {
    id: string;
    patientId: string;
    clinicId: string;
    attachedMedicalCoverages: AttachedMedicalCoverage[];
    visitState: string;
    remark: string;
    startTime: string;
}

export { PatientVisitResponse };
