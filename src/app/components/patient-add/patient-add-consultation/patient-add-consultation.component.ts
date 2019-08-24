import { StoreService } from './../../../services/store.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { SelectItemOptions } from '../../../objects/SelectItemOptions';
import { Doctor } from '../../../objects/SpecialityByClinic';
import { VisitPurpose } from './../../../objects/request/PatientVisit';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-patient-add-consultation',
  templateUrl: './patient-add-consultation.component.html',
  styleUrls: ['./patient-add-consultation.component.scss']
})
export class PatientAddConsultationComponent implements OnInit, OnDestroy {
  @Input() consultationInfoFormGroup: FormGroup;
  @Input() showPrioritySelect: boolean = false;

  isMeridian = false;
  showSpinners = false;

  doctors: Array<SelectItemOptions<Doctor>>;
  visitPurposes: Array<SelectItemOptions<VisitPurpose>>;
  priorities: Array<any> = [
    { label: 'High', value: 'HIGH' },
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Low', value: 'LOW' }
  ];

  constructor(private eRef: ElementRef, private storeService: StoreService, private alertService: AlertService) {}

  ngOnInit() {
    const currDate: Date = new Date();
    this.consultationInfoFormGroup.get('visitDate').patchValue(currDate);
    this.consultationInfoFormGroup.get('time').patchValue(currDate);
    this.consultationInfoFormGroup.get('priority').patchValue('NORMAL', { emitEvent: false });

    console.log('doc list', this.storeService.doctorListByClinic);
    console.log('purpose list', this.storeService.visitPurposeList);
    this.populateDoctor();
    this.populateVisitPurposes();
  }

  ngOnDestroy() {}

  populateVisitPurposes() {
    if (this.storeService.visitPurposeList.length < 1) {
      if (this.storeService.errorMessages['visitPurposeList'] !== undefined) {
        this.alertService.error(this.storeService.errorMessages['visitPurposeList']);
      } else {
        this.storeService.getVisitPurposeList();
      }
    } else {
      this.visitPurposes = this.storeService.visitPurposeList.map((value, index) => {
        return {
          value: value.name,
          label: value.name,
          data: value
        };
      });
    }
  }

  populateDoctor() {
    if (this.storeService.doctorListByClinic.length < 1) {
      if (this.storeService.errorMessages['listDoctorsByClinic'] !== undefined) {
        this.alertService.error(this.storeService.errorMessages['listDoctorsByClinic']);
      } else {
        this.storeService.listDoctorsByClinic();
      }
    } else {
      this.doctors = this.storeService.doctorListByClinic
        .filter(item => item.status === 'ACTIVE')
        .map(item => {
          let options = new SelectItemOptions<Doctor>();
          options.value = item.id;
          options.label = item.displayName;
          options.data = item;
          return options;
        });
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      console.log('clicked inside AddConsultation');
    } else {
      console.log('clicked outside AddConsultation', event.target);
    }
  }
}
