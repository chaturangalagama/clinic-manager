// export interface PatientNote {
//   id: string;
//   patientId: string;
//   noteDetails:{
//     note: string;
//     doctorId: string;
//     status: string;
//     addedDateTime: string;
//   }
// }
// export interface PatientNote {
//   patientNoteId: string;
//   note: string;
//   doctorId: string;
//   doctorName: string;
//   addedDateTime: string;
//   status: string;
//   editMode?: boolean;
// }
export interface PatientNote {
    note: string;
    doctorId: string;
    status: string;
    addedDateTime: string;
}
