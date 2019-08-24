export class AppConfigFile {
  API_LOGIN_URL: string;
  API_URL: string;
  API_DOMAIN: string;
  API_AA_URL: string;
  API_PATIENT_VISIT_URL: string;
  API_DOCUMENT_URL: string;
  API_INVENTORY_SYSTEM_URL: string;
  API_PATIENT_INFO_URL: string;
  API_VITAL_URL: string;
  API_CASE_INFO_URL: string;
  API_CMS_MANAGEMENT_URL: string;
  API_PACKAGE_ITEM_INFO_URL: string;
  API_PAYMENT_URL: string;
  REPORT_URL: string;
  SHOW_COPY_PRESCRIPTION_AFTER: string;

  constructor(
    API_LOGIN_URL?: string,
    API_URL?: string,
    API_DOMAIN?: string,
    API_AA_URL?: string,
    API_PATIENT_VISIT_URL?: string,
    API_DOCUMENT_URL?: string,
    API_INVENTORY_SYSTEM_URL?: string,
    API_PATIENT_INFO_URL?: string,
    API_VITAL_URL?: string,
    API_CASE_INFO_URL?: string,
    API_CMS_MANAGEMENT_URL?: string,
    API_PACKAGE_ITEM_INFO_URL?: string,
    API_PAYMENT_URL?: string,
    REPORT_URL?: string,
    SHOW_COPY_PRESCRIPTION_AFTER?: string
  ) {
    this.API_LOGIN_URL = API_LOGIN_URL || '';
    this.API_URL = API_URL || '';
    this.API_DOMAIN = API_DOMAIN || '';
    this.API_AA_URL = API_AA_URL || '';
    this.API_PATIENT_VISIT_URL = API_PATIENT_VISIT_URL || '';
    this.API_DOCUMENT_URL = API_DOCUMENT_URL || '';
    this.API_INVENTORY_SYSTEM_URL = API_INVENTORY_SYSTEM_URL || '';
    this.API_PATIENT_INFO_URL = API_PATIENT_INFO_URL || '';
    this.API_VITAL_URL = API_VITAL_URL || '';
    this.API_CASE_INFO_URL = API_CASE_INFO_URL || '';
    this.API_CMS_MANAGEMENT_URL = API_CMS_MANAGEMENT_URL || '';
    this.API_PACKAGE_ITEM_INFO_URL = API_PACKAGE_ITEM_INFO_URL || '';
    this.API_PAYMENT_URL = API_PAYMENT_URL || '';
    this.REPORT_URL = REPORT_URL || '';
    this.SHOW_COPY_PRESCRIPTION_AFTER = SHOW_COPY_PRESCRIPTION_AFTER || '';
  }
}
