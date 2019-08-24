import { AlertService } from './../../../../services/alert.service';
import { Observable, Subject } from 'rxjs';
import { StoreService } from './../../../../services/store.service';
import { SelectItemOptions } from './../../../../objects/SelectItemOptions';
import { Diagnosis } from './../../../../objects/response/Diagnosis';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { ConsultationFormService } from './../../../../services/consultation-form.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-consultation-diagnosis-item',
  templateUrl: './consultation-diagnosis-item.component.html',
  styleUrls: ['./consultation-diagnosis-item.component.scss']
})
export class ConsultationDiagnosisItemComponent implements OnInit {
  @Input() itemGroup: FormGroup;
  @Input() attachedMedicalCoverages: FormArray;
  @Input() index: number;
  @Output() onDelete = new EventEmitter<number>();

  attachedPlanId: Array<string> = new Array();

  codes: Array<SelectItemOptions<Diagnosis>>;
  searchTerm = new FormControl();
  diagnosisItems: Diagnosis[] = [];
  diagnosisId;
  description: string;
  loading = false;

  codesTypeahead = new Subject<string>();

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private consultationFormService: ConsultationFormService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    console.log('diagnosis item:: ', this.itemGroup);

    if (this.itemGroup.get('id').value && this.itemGroup.get('icd10Term') && this.itemGroup.get('icd10Term').value) {
      this.codes = [this.itemGroup.value];
      this.onDiagnosisSelected(this.itemGroup.value);
    } else if (this.itemGroup.get('id').value) {
      this.getDiagnosisDetail(this.itemGroup.get('id').value);
    } else {
      this.diagnosisId = '';
    }

    this.attachedPlanId =
      this.attachedMedicalCoverages && this.attachedMedicalCoverages.value.map(coverage => coverage.planId);
    this.attachedMedicalCoverages.valueChanges.subscribe(coverages => {
      this.attachedPlanId = coverages.map(coverage => coverage.planId);
    });

    this.onFilterInputChanged();
  }

  getDiagnosisDetail(id: string) {
    if (!id) {
      return;
    }

    this.apiCmsManagementService.searchDiagnosisByIds([id]).subscribe(
      res => {
        const diagnosis = res.payload;
        const item = diagnosis.find(item => item.id === id);
        if (item) {
          this.itemGroup.patchValue(item, { emitEvent: false });
          this.codes = [this.itemGroup.value];
          this.onDiagnosisSelected(item);
        }
      },
      err => {
        this.alertService.error(JSON.stringify(err.error.message));
      }
    );
  }

  onFilterInputChanged() {
    try {
      this.codesTypeahead
        .pipe(
          distinctUntilChanged((a, b) => b.trim().length === 0),
          debounceTime(400),
          tap(() => (this.loading = true)),
          switchMap((term: string) => {
            return this.apiCmsManagementService.searchDiagnosis(term, this.attachedPlanId);
          })
        )
        .subscribe(
          data => {
            this.loading = false;
            console.log('DATA', data);

            if (data) {
              this.codes = data.payload;
            }
          },
          err => {
            this.loading = false;
            if (err && err.error && err.error.message) {
              this.alertService.error(JSON.stringify(err.error.message));
            }
          }
        );
    } catch (err) {
      console.log('Search Diagnosis Error', err);
    }
  }

  onDiagnosisSelected(option) {
    console.log('DIAGNOSIS SELECTED', option);
    if (option) {
      this.description = option.icd10Term;
      this.itemGroup.patchValue({ id: option.id });
    } else {
      this.description = '';
      this.onFilterInputChanged();
    }

    console.log('itemGroup: ', this.itemGroup);
  }

  onBtnAddClicked() {
    console.log('ADD Item');
    // this.diagnosisItems.push(new Diagnosis());
    this.consultationFormService.initDiagnosis();
  }

  onBtnDeleteClicked() {
    // clear form
    this.description = '';
    this.itemGroup.get('id').patchValue('');

    this.onDelete.emit(this.index);
  }
}
