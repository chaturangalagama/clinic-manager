import { memoTemplate } from './../views/templates/memo';
import { NgxPermissionsService } from 'ngx-permissions';

import { Injectable } from '@angular/core';

import { ApiPatientVisitService } from './api-patient-visit.service';
import { AlertService } from './alert.service';
import { ApiCmsManagementService } from './api-cms-management.service';
import { StoreService } from './store.service';

import { refferalLetterTemplate } from '../views/templates/refferal.letter';

@Injectable()
export class PrintTemplateService {
  paymentInfo;
  medicalCoverageInfo;

  clinic;

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private alertService: AlertService,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.medicalCoverageInfo = this.store.medicalCoverageList;
    this.clinic = this.store.clinic;
  }

  onBtnPrintPatientLabelClicked(patientInfo) {
    this.apiCmsManagementService.searchLabel('PATIENT_LABEL').subscribe(
      res => {
        const template = JSON.parse(res.payload.template);
        const patient = patientInfo;
        const clinic = this.store.clinic;
        console.log("patient id: ", patient);
        const html = template
          .replace(
            '{{clinicAddress}}',
            `${clinic.address.address.toUpperCase() || ''}, SINGAPORE ${clinic.address.postalCode}`
          )
          .replace('{{clinicTel}}', clinic.contactNumber)
          .replace('{{clinicFax}}', clinic.faxNumber)
          .replace('{{id}}', patient.patientNumber)
          .replace('{{name}}', patient.name.toUpperCase())
          .replace('{{gender}}', patient.gender)
          .replace('{{dob}}', patient.dob)
          .replace('{{userIdType}}', patient.userId.idType)
          .replace('{{userId}}', patient.userId.number)
          .replace('{{contact}}', patient.contactNumber.number)
          .replace(
            '{{address}}',
            `${patient.address.address}, ${patient.address.postalCode}`
            // `${patient.address.address}, ${patient.address.country} ${patient.address.postalCode}`
          )
          .replace('{{company}}', patient.company ? patient.company.name : '')
          .replace(
            '{{allergies}}',
            patient.allergies && patient.allergies.length
              ? patient.allergies.map(allergy => allergy.name).join(', ')
              : 'NIL'
          );
        this.printTemplate(html);
      },
      err => this.alertService.error(JSON.stringify(err.error['message']))
    );
  }

  displayPaymentInfo(draft, creditPayments, directPayments, checkIsSummaryOrBreakdown) {
    let breakdownString = '';
    let summaryString = '';

    creditPayments.forEach(payment => {
      if (payment.amount > 0) {
        const coverageName = this.getCoverageName(payment.medicalCoverageId, payment.planId);
        breakdownString += this.mapToHtmlBoldNameAndValue([
          {
            name: 'PAY BY ' + coverageName,
            price: payment.amount
          }
        ]);

        summaryString += summaryString === '' ? coverageName : ' / ' + coverageName;
        console.log("summary string credit: ", summaryString);
      }
    });

    let dprice = directPayments.amount - directPayments.cashRoundAdjustedValue;

    if (!draft) {
      if (directPayments.paymentInfos.length === 1 && directPayments.paymentInfos[0].billMode === "CASH" && directPayments.cashRoundAdjustedValue > 0) // Pay By Cash Only
      {
        // cashOnly = true;
        breakdownString +=
          this.mapToHtmlAdjustment(
            [
              {
                name: 'ADJUSTMENT',
                price: directPayments.cashRoundAdjustedValue
              }
            ]
          ) + this.mapToHtmlDisplayAdjustment(dprice);
        summaryString += summaryString === '' ? 'CASH' : ' / CASH'

      } else {
        directPayments.paymentInfos.forEach((paymentInfo, counter) => {
          let billMode: string = paymentInfo.billMode;
          billMode = billMode.replace(/_/g, " ");

          breakdownString += this.mapToHtmlBoldNameAndValue([
            {
              name: 'PAY BY ' + billMode,
              price: paymentInfo.amount
            }
          ]);

          summaryString += summaryString === '' ? billMode : " / " + billMode;
          console.log("summary string direct: ", summaryString);
        });


      }
    } else { // DRAFT RECEIPT
      console.log("DRAFT!");
      breakdownString += this.mapToHtmlBoldNameAndValue([{
        name: 'OUTSTANDING BALANCE',
        price: directPayments.amount
      }]);
    }

    return checkIsSummaryOrBreakdown === 'summary' ? summaryString : breakdownString;
  }

  getCoverageName(medicalCoverageId, planId) {
    this.medicalCoverageInfo = this.store.medicalCoverageList;
    const coverage = this.medicalCoverageInfo.find(function (x) {
      return x.id === medicalCoverageId;
    });
    return coverage.name.toUpperCase();
  }

  updateLabelTemplate(id, templateName, template) {
    this.apiCmsManagementService.updateLabel(id, templateName, JSON.stringify(template)).subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

  updateAllLabelTemplates() {
    // this.apiCmsManagementService
    //   .updateLabel('5ae03f77dbea1b12fe7d6685', 'BILL', JSON.stringify(billTemplate))
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    // this.apiCmsManagementService
    //   .updateLabel('5ae03f77dbea1b12fe7d6687', 'MEDICAL_CERTIFICATE', JSON.stringify(medicalCertificateTemplate))
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    // this.apiCmsManagementService
    //   .updateLabel('5ae03f77dbea1b12fe7d6686', 'DRUG_LABEL', JSON.stringify(drugLabelTemplate))
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    this.apiCmsManagementService
      .updateLabel('5ae03f77dbea1b12fe7d668a', 'REFERRAL_LETTER', JSON.stringify(refferalLetterTemplate))
      .subscribe(
        res => {
          console.log(res);
        },
        err => console.log(err)
      );

    // this.apiCmsManagementService
    //   .updateLabel('5ae03f77dbea1b12fe7d6689', 'TIME_CHIT', JSON.stringify(timeChitTemplate))
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    // this.apiCmsManagementService
    //   .updateLabel('5ae14ab0dbea1b35bbaa310e', 'PATIENT_LABEL', JSON.stringify(patientLabelTemplate))
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    // this.apiCmsManagementService
    //   .updateLabel(
    //     '5ae2ae6bdbea1b35bbaa310f',
    //     'VACCINATION_CERTIFICATE',
    //     JSON.stringify(vaccinationCertificateTemplate)
    //   )
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => console.log(err)
    //   );

    this.apiCmsManagementService
      .updateLabel('5b1f9ef8bf8d8d03a16fd8ed', 'MEMO', JSON.stringify(memoTemplate))
      .subscribe(
        res => {
          console.log(res);
        },
        err => console.log(err)
      );
  }

  mapToHtml(array) {
    return array.map(
      obj => `<div class="row">
            <div class="col-6">
                ${obj.name}
            </div>
            <div class="col-4">
                <span class="float-right">
                    $${obj.price.toFixed(2)}
                </span>
            </div>
        </div>`
    );
  }

  mapToHtmlAdjustment(array) {
    return array.map(
      obj => `<div class="row">
            <div class="col-6">
                ${obj.name}
            </div>
            <div class="col-6">
                <span class="float-right">
                    ($${obj.price.toFixed(2)})
                </span>
            </div>
        </div>`
    );
  }

  mapToHtmlNoBold(array) {
    return array.map(
      obj => `<div class="row">
            <div class="col-6">
                ${obj.name}
            </div>
            <div class="col-6">
                <span class="float-right">
                    $${obj.price.toFixed(2)}
                </span>
            </div>
        </div>`
    );
  }

  mapToHtmlBoldNameOnly(array) {
    return array.map(
      obj => `<div class="row">
            <div class="col-6">
                ${obj.name}
            </div>
            <div class="col-6">
                <span class="float-right">
                    $${obj.price.toFixed(2)}
                </span>
            </div>
        </div>`
    );
  }

  mapToHtmlBoldNameAndValue(array) {
    return array.map(
      obj => `<div class="row">
            <div class="col-6">
              <strong>
                ${obj.name}
              </strong>
            </div>
            <div class="col-6">
              <strong>
                <span class="float-right">
                    $${obj.price.toFixed(2)}
                </span>
              </strong>
            </div>
        </div>`
    );
  }

  mapToHtmlDisplayAdjustment(price) {
    return `<div class="row">
              <div class="col-6">
                <span>
                  <strong>PAY BY CASH </strong><small>(AFTER ADJUSTMENT)</small>
                </span>
              </div>
              <div class="col-6">
                  <span class="float-right">
                    <strong>
                      $${price.toFixed(2)}
                    </strong>
                  </span>
              </div>
            </div>`;
  }

  printTemplate(template: string) {
    const w = window.open();
    w.document.open();
    w.document.write(template);
    w.document.close();
    console.log('document closed');
    w.onload = () => {
      console.log('window loaded');
      w.window.print();
    };
    w.onafterprint = () => {
      w.close();
    };
  }

  // Calculate discounted price
  getCalculatedPrice(p: ChargeItem) {
    if (p.discountGiven.paymentType === 'DOLLAR') {
      if (p.discountGiven.increaseValue > 0) {
        return (p.charge.price + p.discountGiven.increaseValue) * p.quantity;
      } else {
        return (p.charge.price - p.discountGiven.decreaseValue) * p.quantity;
      }
    } else {
      if (p.discountGiven.increaseValue > 0) {
        return p.charge.price * (1 + p.discountGiven.increaseValue / 100) * p.quantity;
      } else {
        return p.charge.price * (1 - p.discountGiven.decreaseValue / 100) * p.quantity;
      }
    }
  }
}

class ChargeItem {
  charge: Charge;
  discountGiven: DiscountGiven;
  itemCode: string;
  itemId: string;
  quantity: number;
}

class Charge {
  price: number;
  taxIncludeds: boolean;
}

class DiscountGiven {
  decreaseValue: number;
  increaseValue: number;
  paymentType: string;
}