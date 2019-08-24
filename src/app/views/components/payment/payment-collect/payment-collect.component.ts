import { ApiCaseManagerService } from './../../../../services/api-case-manager.service';
import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable, forkJoin } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { StoreService } from '../../../../services/store.service';
import { AlertService } from '../../../../services/alert.service';
import { DialogService } from '../../../../services/dialog.service';
import { ApiPatientInfoService } from '../../../../services/api-patient-info.service';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import { ApiCmsManagementService } from '../../../../services/api-cms-management.service';
import { PaymentService } from '../../../../services/payment.service';
import { PaymentConfirmComponent } from '../../../../components/payment/payment-confirm/payment-confirm.component';
import { PrintTemplateService } from './../../../../services/print-template.service';
import { TempStoreService } from '../../../../services/temp-store.service';

@Component({
  selector: 'app-payment-collect',
  templateUrl: './payment-collect.component.html',
  styleUrls: ['./payment-collect.component.scss']
})
export class PaymentCollectComponent implements OnInit {
  @Output() isRollbacked: EventEmitter<boolean> = new EventEmitter<boolean>();

  consultationInfo;
  collectFormGroup: FormGroup;
  bsModalRef: BsModalRef;

  patientInfo;
  paymentInfo;
  billNo;
  factor = 0.05;

  error: string;
  // routerEventsSubscribe;
  // isRollbacked = false;
  navigatingUrl: string;
  multipleAccessKey: string;
  currentUserAccessing: Set<string>;

  disablePayBtn: Boolean = true;
  isLessThan: Boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private store: StoreService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private modalService: BsModalService,
    private apiCaseManagerService: ApiCaseManagerService,
    private apiPatientVisitService: ApiPatientVisitService,
    private tempStore: TempStoreService,
    private paymentService: PaymentService,
    private printTemplateService: PrintTemplateService
  ) {
    this.multipleAccessKey = `PAYMENT_${this.store.getPatientVisitRegistryId()}`;
    this.currentUserAccessing = new Set();
  }

  ngOnInit() {
    if (!this.store.getPatientId()) {
      alert('No Patient Details');
      this.router.navigate(['pages/patient/list']);
      return;
    }

    /** MULTIPLE ACCESS */
    this.checkMultipleUserAccess();
    /** END OF MULTIPLE ACCESS */

    this.collectFormGroup = this.paymentService.getCollectFormGroup();
    this.consultationInfo = this.paymentService.getConsultationInfo();
    if (!this.consultationInfo) {
        this.apiCaseManagerService.getInvoiceBreakdown(this.store.getCaseId()).subscribe(invoices => {

          console.log('payload invoices', invoices);
          this.paymentInfo = invoices.payload;

          if (this.paymentInfo) {
            this.updateCollectChargeFormGroup();
            this.updatePaymentMethodFormGroup();
          }
        }, err => this.alertService.error(JSON.stringify(err.error.message)));
    } 

    this.collectFormGroup
      .get('paymentFormGroup')
      .get('paymentArray')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(
        values => {
          console.log('this payment info: ', this.paymentInfo);
          console.log('values: ', values);
          const payingMethod = (values as Array<any>).filter(item => item.amount > 0);
          this.collectFormGroup.get('collectChargeFormGroup').patchValue(
            {
              payCashOnly: payingMethod.length === 1 && payingMethod[0].payment === 'CASH'
            },
            { emitEvent: false }
          );
        },
        err => this.alertService.error(JSON.stringify(err.error.message))
      );

    this.collectFormGroup
      .get('paymentFormGroup')
      .get('outstanding')
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(`abcde`, value);
        this.checkDisablePayBtn(value);

        this.isLessThan = Number(value) > 0;
      });

    // this.routerEventsSubscribe = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.navigatingUrl = event.url;
    //     if (event.url === '/pages/payment/charge' && !this.isRollbacked) {
    //       const confirm = this.dialogService.confirm(
    //         'Your changes will be rolled back. \n\nAre you sure want to leave this page?'
    //       );
    //       confirm.subscribe(isConfirm => {
    //         if (isConfirm) {
    //           this.apiPatientVisitService.paymentRollback(this.store.getPatientVisitRegistryId()).subscribe(
    //             res => {
    //               this.isRollbacked = true;
    //               // this.router.navigate([event.url]);
    //               this.paymentService.resetChargeFormGroup();
    //               this.paymentService.resetCollectFormGroup();
    //             },
    //             err => this.alertService.error(JSON.stringify(err.error.message))
    //           );
    //         }
    //       });
    //     }
    //   }
    // });
  }

  checkMultipleUserAccess() {
    const currentUserName = this.store.getUser().userName;
    this.tempStore.tempStoreRetrieve(this.multipleAccessKey).subscribe(
      res => {
        if (res && res.statusCode && res.statusCode === 'S0000') {
          if (res.payload) {
            const dataJsonString = res.payload.value;
            this.currentUserAccessing = new Set(JSON.parse(dataJsonString));
            if (this.currentUserAccessing.size > 0) {
              this.alertService.warn('This page is being access by another user. Please verify before making changes');
            }
            if (!this.currentUserAccessing.has(currentUserName)) {
              // Add Current User to Set
              this.currentUserAccessing.add(currentUserName);
              // Convert Data to JSON String and store into tempstore
              const dataToJsonString = JSON.stringify(Array.from(this.currentUserAccessing));
              this.tempStore.tempStore(this.multipleAccessKey, dataToJsonString).subscribe(
                result => {
                  console.log('PAYMENT_TEMP_STORE', result);
                },
                err => {
                  this.alertService.error(JSON.stringify(err.error.message));
                }
              );
            }
          } else {
            //Add new Set
            const data = new Set();
            data.add(currentUserName);
            // Convert Data to JSON String and store into tempstore
            const dataToJsonString = JSON.stringify(Array.from(data));
            this.tempStore.tempStore(this.multipleAccessKey, dataToJsonString).subscribe(
              result => {
                console.log('PAYMENT_TEMP_STORE', res);
              },
              err => {
                this.alertService.error(JSON.stringify(err.error.message));
              }
            );
          }
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  // ngOnDestroy() {
  //   if (this.routerEventsSubscribe) {
  //     this.routerEventsSubscribe.unsubscribe();
  //   }
  // }

  canDeactivate(): Observable<boolean> | boolean {
    // if (this.navigatingUrl === '/pages/payment/charge') {
    //   if (this.isRollbacked) {
    //     this.paymentService.resetChargeFormGroup();
    //     this.paymentService.resetCollectFormGroup();
    //   }
    //   return this.isRollbacked;
    // }
    this.removeCurrentUserFromTempStore();
    return true;
  }

  async removeCurrentUserFromTempStore() {
    await this.tempStore
      .tempStoreRetrieve(this.multipleAccessKey)
      .toPromise()
      .then(res => {
        if (res && res.statusCode && res.statusCode === 'S0000') {
          if (res.payload) {
            const dataJsonString = res.payload.value;
            this.currentUserAccessing = new Set(JSON.parse(dataJsonString));
          }
        }
      })
      .catch(err => this.alertService.error(JSON.stringify(err.error.message)));

    this.currentUserAccessing.delete(this.store.getUser().userName);

    console.log('PAYMENT_TEMP_STORE', this.currentUserAccessing);
    if (this.currentUserAccessing.size > 0) {
      //update
      const dataToJsonString = JSON.stringify(Array.from(this.currentUserAccessing));
      await this.tempStore
        .tempStore(this.multipleAccessKey, dataToJsonString)
        .toPromise()
        .then(result => {
          console.log('PAYMENT_TEMP_STORE', result);
        })
        .catch(err => {});
    } else {
      // delete
      await this.tempStore
        .tempStoreRemove(this.multipleAccessKey)
        .toPromise()
        .then(resss => {})
        .catch(err => {});
    }
  }

  removeConcurrentRecordSync() {
    //retreive temp store
    if (!this.multipleAccessKey) {
      return;
    }

    const response = this.tempStore.tempStoreRetrieveInSync(this.multipleAccessKey);
    const responseObj = JSON.parse(response) || {};
    if (responseObj.payload || { value: '' }.value) {
      console.log(responseObj.payload.value);
      this.currentUserAccessing = new Set(JSON.parse(responseObj.payload.value));

      let removeResponse;
      if (
        this.currentUserAccessing.size === 1 &&
        this.currentUserAccessing.values().next().value === this.store.getUser().userName
      ) {
        removeResponse = this.tempStore.tempStoreRemoveInSync(this.multipleAccessKey);
      } else {
        this.currentUserAccessing.delete(this.store.getUser().userName);
        removeResponse = this.tempStore.tempStoreInSync(
          this.multipleAccessKey,
          JSON.stringify(this.currentUserAccessing)
        );
      }
      console.log(removeResponse);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event: any) {
    this.removeConcurrentRecordSync();
    return false;
  }

  // Lifecycle
  updateCollectChargeFormGroup() {
    console.log('Payment Info', this.paymentInfo);
    let otherCharge = 0;
    let otherChargeGst = 0;
    let totalCharge = 0;
    let cashAdjustmentRounding = 0;
    this.paymentInfo.forEach( invoice =>{
      otherChargeGst += invoice.taxAmount;
      otherCharge += (invoice.payableAmount - invoice.taxAmount);
      totalCharge += invoice.payableAmount;
      cashAdjustmentRounding += invoice.cashAdjustmentRounding;
      // TODO: ASSIGN cashRoundAdjustedValue
    });

    console.log("pa-co otherCharge: ",otherCharge)
    
    this.collectFormGroup.get('collectChargeFormGroup').patchValue({
      otherCharge,
      otherChargeGst,
      cashRoundAdjustedValue: cashAdjustmentRounding
    });

    this.paymentService.setCollectFormGroup(this.collectFormGroup);
  }

  updatePaymentMethodFormGroup() {
    let otherCharge = 0;
    let otherChargeGst = 0;
    let totalCharge = 0;
    let cashAdjustmentRounding = 0;
    this.paymentInfo.forEach(invoice => {
      otherChargeGst += invoice.taxAmount;
      otherCharge += (invoice.payableAmount - invoice.taxAmount);
      totalCharge += invoice.payableAmount;
      cashAdjustmentRounding += invoice.cashAdjustmentRounding;
    });
    this.collectFormGroup.get('paymentFormGroup').patchValue({
      otherCharge,
      otherChargeGst,
      cashRoundAdjustedValue: cashAdjustmentRounding
    });

    this.checkDisablePayBtn(otherCharge.toFixed(0));
  }

  checkDisablePayBtn(outstandingStr: string) {
    const outstanding: number = Number(outstandingStr);
    const outstandingCent: string = outstandingStr.slice(-1);

    if (outstanding > 0 || (outstandingCent !== '0' && outstandingCent !== '5')) {
      this.disablePayBtn = true;
      return;
    }

    if (outstanding < 0) {
      const payCashAmount = (
          (this.collectFormGroup.get('paymentFormGroup').get('paymentArray') as FormArray).value.find(
            item => item.payment === 'CASH'
          ) || { amount: 0 }
      ).amount || 0;

      if (payCashAmount < Math.abs(outstanding)) {
        this.disablePayBtn = true;
        return;
      }
    }

    this.disablePayBtn = false;
  }

  // Action
  onBtnBackClicked() {
    // this.router.navigate(['/pages/payment/charge']);
    const confirm = this.dialogService.confirm(
      'Your changes will be rolled back. \n\nAre you sure want to leave this page?'
    );
    confirm.subscribe(isConfirm => {
      if (isConfirm) {
        this.apiPatientVisitService.paymentRollback(this.store.getPatientVisitRegistryId()).subscribe(
          res => {
            // this.isRollbacked = true;
            // this.router.navigate([event.url]);
            this.paymentService.resetChargeFormGroup();
            this.paymentService.resetCollectFormGroup();
            this.isRollbacked.emit(true);
          },
          err => this.alertService.error(JSON.stringify(err.error.message))
        );
      }
    });
  }

  onBtnSaveClicked() {
    if (this.disablePayBtn) {
      return;
    }

    this.disablePayBtn = true;

    const chargeBack = parseFloat(
      this.collectFormGroup
        .get('paymentFormGroup')
        .get('chargeBack')
        .value.toFixed(2)
    );
    if (chargeBack > 0) {
      if (confirm(`Change needed: $${(chargeBack / 100).toFixed(2)}`)) {
        this.executePay();
      } else {
        this.disablePayBtn = false;
      }
    } else {
      this.executePay();
    }
  }

  executePay() {
    let billArr = [];
    this.collectFormGroup
      .get('paymentFormGroup')
      .get('paymentArray')
      .value.forEach(payment => {
        if (payment.amount) {
          if (payment.payment === 'CASH') {
            console.log("pa-col billArr in CASH: ",billArr);
            const amount = parseFloat(
              (
                payment.amount -
                Number(
                  this.collectFormGroup
                    .get('paymentFormGroup')
                    .get('chargeBack')
                    .value.toFixed(2)
                )
              ).toFixed(2)
            );
            billArr.push({
              billMode: payment.payment,
              amount: amount
            });
          } else if (payment.payment === 'CHEQUE') {
            billArr.push({
              billMode: payment.payment,
              amount: payment.amount,
              externalTransactionId: payment.transactionId,
              bank: payment.bank
            });
          } else {
            billArr.push({
              billMode: payment.payment,
              amount: payment.amount,
              externalTransactionId: payment.transactionId
            });
          }
        }
      });

    console.log("pa-col billArr: ",billArr);

    if (!billArr.length) {
      billArr.push({
        billMode: 'CASH',
        amount: 0,
        cashRoundAdjustedValue: 0
      });
    } else if (billArr.length === 1) {
      const bill = billArr[0];
      if (bill.billMode === 'CASH') {
        bill.cashRoundAdjustedValue = (Math.floor(bill.amount * (1 / this.factor)) * this.factor).toFixed(2);
      }
    } else {
      billArr = billArr.filter(bill => bill.amount);
    }

    const bill = billArr.map( (bill ,index)=> {return {
      // "caseId": this.store.getCaseId(),
      "amount": bill.amount,
      "billMode": bill.billMode,
      "externalTransactionId": bill.externalTransactionId || ''
    }});

    console.log("pa-col bill: ",bill);

    // forkJoin(
      // bill.map( (payment,index) => 
        this.apiCaseManagerService.recordNewPayment(this.store.getCaseId(), bill)
       .subscribe(
          arr => {
            this.apiPatientVisitService.completed(this.store.getPatientVisitRegistryId()).subscribe(
              res => {
                this.billNo = res.payload.billPaymentId;
                const initialState = {};
                this.bsModalRef = this.modalService.show(PaymentConfirmComponent, {
                  initialState,
                  class: 'modal-lg',
                  backdrop: 'static'
                });

                // Subscription for buttons on modal
                this.bsModalRef.content.printClicked.subscribe(isPrint => {
                  this.printReceipt();
                  this.bsModalRef.hide();
                  this.router.navigate(['patient']);
                });

                this.bsModalRef.content.nextClicked.subscribe(isNext => {
                  this.bsModalRef.hide();
                  this.router.navigate(['patient']);
                });
              },
              err => {
                this.alertService.error(JSON.stringify(err.error.message));
                this.disablePayBtn = false;
              }
            );
          },
          err => {
            this.alertService.error(JSON.stringify(err.error.message));
          })
      //  );
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.code === '0x003E' && !this.disablePayBtn) {
      this.onBtnSaveClicked();
    }
  }

  onError(err) {
    this.error = err.error.message;
    this.alertService.error(JSON.stringify(err));
    window.scroll(0, 0);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 115) {
      console.log('F4');
      if (this.collectFormGroup.valid && !this.disablePayBtn) {
        this.onBtnSaveClicked();
      }
    }
  }

  // Utils
  printReceipt() { }
}