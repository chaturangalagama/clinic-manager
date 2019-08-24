import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { Router } from '@angular/router';
import { Page } from '../../../model/page';

@Component({
  selector: 'app-patient-history-list',
  templateUrl: './patient-history-list.component.html',
  styleUrls: ['./patient-history-list.component.scss']
})
export class PatientHistoryListComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() page: Page
  @Output() getNewPage: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(private store: StoreService, private router: Router) {}

  ngOnInit() {}

  setPage(pageInfo) {
    this.getNewPage.emit(pageInfo.offset);
  }

  onBtnDetailClicked(index) {
    const patientDetailFormGroup = this.formGroup.parent as FormGroup;
    patientDetailFormGroup.patchValue({
      isHistoryList: false,
      historyDetailIndex: index
    });
  }

  onBtnEditClicked(index) {}

  onBtnDeleteClicked(index) {}

  toCaseDetail(caseId: string) {
    this.store.setCaseId(caseId);
    this.router.navigate(['/pages/case/detail']);
  }
}
