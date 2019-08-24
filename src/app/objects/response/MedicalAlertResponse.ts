export class MedicalAlertResponse {
  alertId: string;
  alertType: string;
  name: string;
  remark: string;
  priority: string;
  addedDate: string;
  expiryDate: Object;

  constructor(
    alertId?: string,
    alertType?: string,
    name?: string,
    remark?: string,
    priority?: string,
    addedDate?: string,
    expiryDate?: Object
  ) {
    this.alertId = alertId || '';
    this.name = name || '';
    this.remark = remark || '';
    this.priority = priority || '';
    this.addedDate = addedDate || '';
    this.expiryDate = expiryDate || '';
    this.alertType = alertType || '';
  }
}
