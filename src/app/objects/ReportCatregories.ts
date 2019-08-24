export class ReportCategories {
  reportCategories: ReportCategory[];

  constructor(reportCategories?: ReportCategory[]) {
    this.reportCategories = reportCategories;
  }
}

export class ReportCategory {
  categoryName?: string;
  reports?: Report[];

  constructor(categoryName?: string, reports?: Report[]) {
    this.categoryName = categoryName || '';
    this.reports = reports ? reports : new Array<Report>();
  }
}

export class Report {
  reportName: string;
  reportDisplayName: string;
  params: string[];
  roles: string[];

  constructor(reportName?: string, reportDisplayName?: string, params?: string[], roles?: string[]) {
    this.reportName = reportName || '';
    this.reportDisplayName = reportDisplayName || '';
    this.params = params ? params : [];
    this.roles = roles ? roles : [];
  }
}
