export const navigation = [
  {
    name: 'Patient Registry',
    url: '/pages/patient/list',
    icon: '',
    svgIcon: '/assets/svg/queue2.svg'
  },
  {
    name: 'Appointments',
    url: '/pages/appointments',
    icon: '',
    svgIcon: '/assets/svg/appointments.svg'
  },
  {
    name: 'Patients',
    url: '/pages/patient/search',
    icon: 'icon-patients',
    svgIcon: '/assets/svg/patients.svg'
  },
  {
    name: 'Claim',
    url: '/pages/claim',
    icon: '',
    svgIcon: '/assets/svg/claims.svg',
    permissions: ['ROLE_MHCP_LIST', 'ROLE_MHCP_LIST_HQ']
  },
  {
    name: 'Reports',
    url: '/pages/report',
    icon: '',
    svgIcon: '/assets/svg/reports.svg'
  },
  {
    name: 'Communications',
    url: '/pages/communications/',
    icon: '',
    svgIcon: '/assets/svg/communications.svg'
  },
  {
    name: 'Case Manager',
    url: '/pages/case/list',
    icon: '',
    svgIcon: '/assets/svg/appointments.svg'
  },
  {
    name: 'Test',
    url: '/pages/test',
    icon: '',
    svgIcon: '/assets/svg/appointments.svg'
  }
];
