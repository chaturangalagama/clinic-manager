// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=dua` then `environment.dua.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    envName: 'dua',
    apiPath: {
      API_URL: 'https://devserver.lippoinnolab.com/cms-dua',
      API_DOMAIN: 'devserver.lippoinnolab.com',
      API_AA_URL: 'https://devserver.lippoinnolab.com/aacore',
      API_PATIENT_VISIT_URL: 'https://devserver.lippoinnolab.com/cms-dua',
      API_INVENTORY_SYSTEM_URL: 'https://devserver.lippoinnolab.com/cms-dua',
      API_PATIENT_INFO_URL: 'https://devserver.lippoinnolab.com/cms-dua',
      API_CMS_MANAGEMENT_URL: 'https://devserver.lippoinnolab.com/cms-dua',
      REPORT_URL: 'https://reports.healthwaymedical.com.sg/reporting-ui/',
      SHOW_COPY_PRESCRIPTION_AFTER: '26-07-2018T00:00:00'
    }
  };
