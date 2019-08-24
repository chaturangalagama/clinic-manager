export const ReportParams = {
  params: [
    'clinicId',
    'clinicIds',
    'doctorIds',
    'startDate',
    'endDate',
    'drugCode',
    'itemCodes',
    'itemCategoryCodes',
    'financialPlanId',
    'coverageType',
    'status',
    'patientId',
    'monthlyReport'
  ]
};

export const ReportCategorization = {
  reportCategories: [
    {
      categoryName: 'Patient Registration Menu',
      reports: [
        {
          reportName: 'daily_patient_register_report',
          reportDisplayName: 'Daily Patient Register Report',
          params: ['clinicIds', 'doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_DAILY_PATIENT_REGISTER_REPORT']
          // roles: ['MY_ROLE']
        }
      ]
    },
    {
      categoryName: 'Patient Visit Summary & Drug Dispensing Menu',
      reports: [
        {
          reportName: 'drug_dispensing_enquiry',
          reportDisplayName: 'Drug Dispensing Enquiry',
          params: ['doctorIds', 'startDate', 'endDate', 'drugCode'],
          roles: ['ROLE_DRUG_DISPENSING_ENQUIRY']
        },
        {
          reportName: 'patient_treatment_records',
          reportDisplayName: 'Patient Treatment Records',
          params: ['doctorIds', 'startDate', 'endDate', 'itemCodes', 'itemCategoryCodes'],
          roles: ['ROLE_PATIENT_TREATMENT_RECORD']
        },
        {
          reportName: 'medical_certificate_report',
          reportDisplayName: 'Medical Certificate Report',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_MEDICAL_CERTIFICATE_REPORT']
        },
        {
          reportName: 'patient_consultation_history_enquiry',
          reportDisplayName: 'Patient Consultation History Enquiry',
          params: ['patientId'],
          roles: ['ROLE_PATIENT_CONSULTATION_HISTORY']
        }
      ]
    },
    {
      categoryName: 'POS Management Menu',
      reports: [
        {
          reportName: 'pos_collection_summary',
          reportDisplayName: 'POS Collection Summary',
          params: ['startDate', 'endDate', 'clinicIds'],
          roles: ['ROLE_POS_COLLECTION_SUMMARY']
        },
        {
          reportName: 'revenue_collection_report',
          reportDisplayName: 'Revenue Collection Report',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_REVENUE_COLLECTION_REPORT']
        },
        {
          reportName: 'revenue_management_report',
          reportDisplayName: 'Revenue Management Report',
          params: ['clinicIds', 'startDate', 'endDate'],
          roles: ['ROLE_REVENUE_MANAGEMENT_REPORT']
        }
      ]
    },
    {
      categoryName: 'Corporate Management Menu',
      reports: [
        {
          reportName: 'private_corporate_patient_listing',
          reportDisplayName: 'Private Corporate Patient Listing',
          params: ['doctorIds', 'startDate', 'endDate', 'coverageType', 'status', 'clinicIds'],
          roles: ['ROLE_PRIVATE_CORPORATE']
        },
        {
          reportName: 'report_on_outstanding_bill_invoice',
          reportDisplayName: 'Report on Outstanding Bill Invoice',
          params: ['clinicIds', 'doctorIds', 'startDate', 'endDate', 'coverageType', 'status'],
          roles: ['ROLE_REPORT_ON_OUTSTANDING_BILL_INVOICE']
        },
        {
          reportName: 'weekly_monthly_revenue_report_by_clinic',
          reportDisplayName: 'Weekly Monthly Revenue Report by Clinic',
          params: ['clinicIds', 'startDate', 'endDate'],
          roles: ['ROLE_WEEKLY_MONTHLY_REVENUE_REPORT_BY_CLINIC']
        },
        {
          reportName: 'ioc_patient',
          reportDisplayName: 'IOC Patient',
          params: ['startDate', 'endDate'],
          roles: ['ROLE_IOC_PATIENT']
        },
        {
          reportName: 'corporate_revenue_summary',
          reportDisplayName: 'Corporate Revenue Summary',
          params: ['startDate', 'endDate'],
          roles: ['ROLE_PATIENT_REVENUE_SUMMARY']
        }
      ]
    },
    {
      categoryName: 'Patient Management Reports',
      reports: [
        {
          reportName: 'laboratory_service_report',
          reportDisplayName: 'Laboratory Service Report',
          params: ['startDate', 'endDate', 'clinicIds'],
          roles: ['ROLE_LABORATORY_SERVICE_REPORT']
        }
      ]
    },
    {
      categoryName: 'Clinic Management Reports',
      reports: [
        {
          reportName: 'doctor_revenue_report',
          reportDisplayName: 'Doctor Revenue Report',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_DOCTOR_REVENUE_REPORT']
        },
        {
          reportName: 'report_on_treatment',
          reportDisplayName: 'Report on Treatment',
          params: ['doctorIds', 'startDate', 'endDate', 'clinicIds'],
          roles: ['ROLE_REPORT_ON_TREATMENT']
        },
        {
          reportName: 'report_on_procedure_category',
          reportDisplayName: 'Report on Procedure Category',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_REPORT_ON_PROCEDURE_CATEGORY']
        },
        {
          reportName: 'doctors_patient_seen',
          reportDisplayName: 'Doctors Patient Seen',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_DOCTORS_PATIENT_SEEN']
        },
        {
          reportName: 'report_on_patient_referral',
          reportDisplayName: 'Report on Patient Referral',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_REPORT_ON_PATIENT_REFERRAL']
        },
        {
          reportName: 'report_on_weekly_revenue_summary',
          reportDisplayName: 'Report on Weekly Revenue Summary',
          params: ['startDate', 'endDate', 'clinicIds'],
          roles: ['ROLE_REPORT_ON_WEEKLY_REVENUE_SUMMARY']
        },
        {
          reportName: 'report_on_revenue_summary',
          reportDisplayName: 'Report on Revenue Summary',
          params: ['doctorIds', 'startDate', 'endDate'],
          roles: ['ROLE_REPORT_ON_REVENUE_SUMMARY']
        },
        {
          reportName: 'report_on_sms_utilization',
          reportDisplayName: 'Report on SMS Utilization',
          params: ['startDate', 'endDate'],
          roles: ['ROLE_REPORT_ON_SMS_UTILIZATION']
        }
      ]
    }
  ]
};
