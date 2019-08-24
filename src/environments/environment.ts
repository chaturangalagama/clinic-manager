// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  envName: 'dev',
  apiPath: {
    API_LOGIN_URL: 'http://localhost:8089',
    API_URL: 'https://devserver.lippoinnolab.com',
    API_DOMAIN: 'devserver.lippoinnolab.com',
    API_AA_URL: 'https://devserver.lippoinnolab.com/aacore',
    API_PATIENT_VISIT_URL: 'https://devserver.lippoinnolab.com/cms-dua/patient-visit',
    API_DOCUMENT_URL: 'https://devserver.lippoinnolab.com/cms-dua/document-management',
    API_INVENTORY_SYSTEM_URL: 'https://devserver.lippoinnolab.com/cms-dua',
    API_PATIENT_INFO_URL: 'https://devserver.lippoinnolab.com/cms-dua',
    API_VITAL_URL: 'https://devserver.lippoinnolab.com/cms-dua/vital',
    API_CASE_INFO_URL: 'https://devserver.lippoinnolab.com/cms-dua/case',
    API_PAYMENT_URL: 'https://devserver.lippoinnolab.com/cms-dua/charging',
    API_CMS_MANAGEMENT_URL: 'https://devserver.lippoinnolab.com/cms-dua',
    REPORT_URL: 'https://reports.healthwaymedical.com.sg/reporting-ui/',
    API_PACKAGE_ITEM_INFO_URL: 'https://devserver.lippoinnolab.com/cms-dua/item',
    SHOW_COPY_PRESCRIPTION_AFTER: '26-07-2018T00:00:00'
  }
};
