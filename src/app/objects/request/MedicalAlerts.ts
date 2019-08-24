export class MedicalAlerts {
  alertType: string;
  name: string;
  remark: string;
  priority: string;
  addedDate: string;
  expiryDate: Object;

  constructor(
    alertType?: string,
    name?: string,
    remark?: string,
    priority?: string,
    addedDate?: string,
    expiryDate?: Object
  ) {
    this.name = name || '';
    this.remark = remark || '';
    this.priority = priority || '';
    this.addedDate = addedDate || '';
    this.expiryDate = expiryDate || '';
    this.alertType = alertType || '';
  }
}
