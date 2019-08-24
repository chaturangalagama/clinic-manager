import { AlertService } from './../../../services/alert.service';
import { ConsultationFormService } from './../../../services/consultation-form.service';
import { StoreService } from './../../../services/store.service';
import { Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-consultation-diagnosis',
  templateUrl: './consultation-diagnosis.component.html',
  styleUrls: ['./consultation-diagnosis.component.scss']
})
export class ConsultationDiagnosisComponent implements OnInit {
  @Input() diagnosisIds: FormArray;
  @Input() attachedMedicalCoverages: FormArray;

  private componentDestroyed: Subject<void> = new Subject();

  constructor(
    private consultationFormService: ConsultationFormService,
    private store: StoreService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getDiagnosisArrays();

    this.store
      .getPatientVisitIdRefresh()
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(id => {
        if (id) {
          console.log('ID changes to: ', id);
          // RESET FORMs
          this.reset();
          this.getDiagnosisArrays();
        }
      });
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  getDiagnosisArrays() {
    if (this.diagnosisIds.value.length > 0 && this.diagnosisIds.value[0].id !== '') {
      const tempDiagnosisArray = this.diagnosisIds.value.map(x => {
        return x.id;
      });

      this.apiCmsManagementService.searchDiagnosisByIds(tempDiagnosisArray).subscribe(
        res => {
          this.diagnosisIds.controls = [];
          const diagnosis = res.payload;
          diagnosis.forEach((diagnosisItem, index) => {
            this.diagnosisIds.push(
              this.fb.group({
                icd10Code: diagnosisItem.icd10Code,
                icd10Id: diagnosisItem.icd10Id,
                icd10Term: diagnosisItem.icd10Term,
                id: diagnosisItem.id,
                snomedId: diagnosisItem.snomedId,
                status: diagnosisItem.status
              })
            );
          });
        },
        err => {
          this.alertService.error(JSON.stringify(err.error.message));
        }
      );
    }
  }

  onBtnAddClicked() {
    console.log('ADD Item');
    this.consultationFormService.initDiagnosis();
  }

  reset() {
    while (this.diagnosisIds.controls.length > 0) {
      this.diagnosisIds.removeAt(0);
    }
  }

  onBtnDeleteClicked(index) {
    this.consultationFormService.removeDiagnosis(index);
  }
}
