export class PatientNoteAdd {
  note: string;
  doctorId: string;
  addedDateTime: string;
  status?: string;

  constructor(note: string, doctorId: string, addedDateTime: string, status?: string) {
    this.note = note || '';
    this.doctorId = doctorId || '';
    this.addedDateTime = addedDateTime || '';
    this.status = status || 'ACTIVE';
  }
}
