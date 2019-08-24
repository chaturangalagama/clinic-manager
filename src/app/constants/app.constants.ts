// export const API_URL = 'https://devserver.lippoinnolab.com';

export const API_DOMAIN = ['devserver.lippoinnolab.com', 'cmsuatapi.lippoinnolab.com', 'api.healthwaymedical.com.sg'];
// export const API_AA_URL = 'https://devserver.lippoinnolab.com/aacore';
// export const API_PATIENT_VISIT_URL = 'https://devserver.lippoinnolab.com/patient-visit';
// export const API_INVENTORY_SYSTEM_URL = 'http://127.0.0.1:8902';
// export const API_PATIENT_INFO_URL = 'https://devserver.lippoinnolab.com/patient-info';
// export const API_CMS_MANAGEMENT_URL = 'https://devserver.lippoinnolab.com/cms-management-proxy';

export const DISPLAY_DATE_FORMAT = 'DD-MM-YYYY';
export const DISPLAY_DATE_TIME_NO_SECONDS_FORMAT = 'DD-MM-YYYY HH:mm';
export const DB_FULL_DATE_FORMAT = 'DD-MM-YYYYTHH:mm:ss';
export const DB_FULL_DATE_FORMAT_NO_SECOND = 'DD-MM-YYYYTHH:mm';
export const DB_FULL_DATE_TIMEZONE = 'ddd MMM DD YYYY HH:mm:ss ZZ';
export const DB_FULL_DATE_TIMEZONE_NO_SPACE = 'YYYY-MM-DDTHH:mm:ss.SSS';
export const DB_VISIT_DATE_FORMAT = 'DD-MM-YYYYT00:00:00';

export const INPUT_DELAY = 500;

export const GST = 1.07;

export const MEDICAL_COVERAGES = ['INSURANCE', 'CORPORATE', 'CHAS', 'MEDISAVE'];

export const PATIENT_LIST_TABLE_CONFIG = [
  { name: 'Number', prop: 'number', flexGrow: 1 }, // Let display name be #
  { name: 'Visit no', prop: 'visitno', flexGrow: 2 },
  { name: 'Name', flexGrow: 2 },
  { name: 'NRIC', flexGrow: 2 },
  { name: 'Time', flexGrow: 1 },
  { name: 'Doctor', flexGrow: 2 },
  { name: 'Purpose', flexGrow: 3 },
  { name: 'Remarks', flexGrow: 1 },
  { name: 'Status', flexGrow: 1 },
  { name: 'Action', flexGrow: 1 },
  { name: 't', prop: 'patientId', flexGrow: 0 },
  { name: 't', prop: 'patientRegistryId', flexGrow: 0 },
  { name: 't', prop: 'consultationId', flexGrow: 0 }
];

export const PATIENT_LIST_ENTRY_COUNTS_DROPDOWN = [
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  {
    value: '100',
    label: '100'
  }
];

export const PATIENT_STATUSES = ['INITIAL', 'CONSULT', 'POST_CONSULT', 'PAYMENT', 'COMPLETE'];

export const PATIENT_LIST_ACTION_LIST_DROPDROWN =  ['Vital Signs', 'Update Visit Details'];

export const ALLERGY_TYPES = [
  'SPECIFIC_DRUG',
  'NAME_STARTING_WITH',
  'NAME_CONTAINING',
  'ALLERGY_GROUP',
  'FOOD',
  'OTHER'
];

export const ALLERGIES = ['nut allergy', 'egg allergy', 'other allergy', 'unknown allergy'];

export const ALERT_TYPES = ['CHRONIC_DISEASE', 'MEDICAL_CONDITION', 'MEDICATION', 'OTHER'];

export const ALERT_PRIORITY = ['HIGH', 'LOW'];

export const MC_REASONS = [
  'UNFIT FOR DUTY',
  'UNFIT FOR ICT',
  'UNFIT FOR SCHOOL',
  'EXCUSED SHOES/SOCKS',
  'UNFIT FOR PE',
  'EXCUSED LOWER LIMB ACTIVITIES',
  'LIGHT DUTIES ONLY',
  'FIT FOR DUTY',
  'UNFIT FOR IPPT',
  'FIT FOR SCHOOL',
  'UNFIT FOR REMEDIAL TRAINING',
  'HOSPITALISATION LEAVE',
  'MATERNITY LEAVE',
  'OUTPATIENT SICK LEAVE',
  'UNFIT FOR PHYSICAL ACTIVITIES',
  'OTHERS'
];

export const MC_REASONS_DROPDOWN = [
  { label: 'UNFIT FOR DUTY', value: 'UNFIT FOR DUTY' },
  { label: 'UNFIT FOR ICT', value: 'UNFIT FOR ICT' },
  { label: 'UNFIT FOR SCHOOL', value: 'UNFIT FOR SCHOOL' },
  { label: 'EXCUSED SHOES/SOCKS', value: 'EXCUSED SHOES/SOCKS' },
  { label: 'UNFIT FOR PE', value: 'UNFIT FOR PE' },
  { label: 'EXCUSED LOWER LIMB ACTIVITIES', value: 'EXCUSED LOWER LIMB ACTIVITIES' },
  { label: 'LIGHT DUTIES ONLY', value: 'LIGHT DUTIES ONLY' },
  { label: 'FIT FOR DUTY', value: 'FIT FOR DUTY' },
  { label: 'UNFIT FOR IPPT', value: 'UNFIT FOR IPPT' },
  { label: 'FIT FOR SCHOOL', value: 'FIT FOR SCHOOL' },
  { label: 'UNFIT FOR REMEDIAL TRAINING', value: 'UNFIT FOR REMEDIAL TRAINING' },
  { label: 'HOSPITALISATION LEAVE', value: 'HOSPITALISATION LEAVE' },
  { label: 'MATERNITY LEAVE', value: 'MATERNITY LEAVE' },
  { label: 'OUTPATIENT SICK LEAVE', value: 'OUTPATIENT SICK LEAVE' },
  { label: 'UNFIT FOR PHYSICAL ACTIVITIES', value: 'UNFIT FOR PHYSICAL ACTIVITIES' },
  { label: 'OTHERS', value: 'OTHERS' }
];

export const MC_HALFDAY_OPTIONS = [
  { label: 'AM - Last Day', value: 'AM_LAST' },
  { label: 'PM - First Day', value: 'PM_FIRST' }
];

export const HEADER_TITLES = [
  { url: '/pages/patient/list', value: 'Patient Registry' },
  { url: '/pages/patient', value: 'Patient Registry' },
  { url: '/pages/consultation/add', value: 'Consultation' },
  { url: '/pages/patient/search', value: 'Patients / Search Patients' },
  { url: '/pages/patient/detail', value: 'Patient Particulars' },
  { url: '/pages/patient/detail?tabIndex=1', value: 'Patient Particulars' },
  { url: '/pages/patient/add', value: 'Add New Patient' },
  { url: '/pages/payment/charge', value: 'Collect Payment' },
  { url: '/pages/payment/collect', value: 'Collect Payment' },
  { url: '/pages/communications/main/follow-ups', value: 'Communications' },
  { url: '/pages/communications', value: 'Communications' },
  { url: '/pages/claim', value: 'Claims' },
  { url: '/pages/report', value: 'Reports' },
  { url: '/pages/report/search', value: 'Reports' },
  { url: '/pages/case/list', value: 'Case Manager' },
  { url: '/pages/case/detail', value: 'Case Details' }
];

export const PATIENT_INFO_KEYS = [
  'title',
  'preferredMethodOfCommunication',
  'consentGiven',
  'race',
  'preferredLanguage',
  'name',
  'dob',
  'userId',
  'gender',
  'contactNumber',
  'secondaryNumber',
  'status',
  'address',
  'emailAddress',
  'emergencyContactNumber',
  'company',
  'nationality',
  'maritalStatus',
  'allergies',
  'patientVaccinations'
];

export const VISIT_MANAGEMENT_TABS = [
  'Profile',
  'Vital Signs',
  'Consultation',
  'Medical Services',
  'Coverage',
  'Documents',
  'Dispensing',
  'Printing',
  'Payment'
];

export const CHAS_BALANCE_UNAVAILABLE = "CHAS balance can't be retrieved. Please check with the portal.";
