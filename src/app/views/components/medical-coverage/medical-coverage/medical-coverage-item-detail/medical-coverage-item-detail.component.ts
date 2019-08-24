import { Address } from './../../../../../objects/UserRegistration';
import { FormGroup, FormBuilder, Form, FormArray } from '@angular/forms';
import { ContactPerson, MedicalCoverageSelected, CoverageSelected } from './../../../../../objects/MedicalCoverage';
import { Component, OnInit, Input } from '@angular/core';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-medical-coverage-item-detail',
  templateUrl: './medical-coverage-item-detail.component.html',
  styleUrls: ['./medical-coverage-item-detail.component.scss']
})
export class MedicalCoverageItemDetailComponent implements OnInit {

  coverageSelected: MedicalCoverageSelected;

  @Input() policyHolderInfo;

  @Input() coverage: CoverageSelected;

  @Input() patientCoverageItem: FormGroup;

  contact: ContactPerson;

  address;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.initaliseDetails();

    this.subscribeChanges();
  }

  initaliseDetails() {
    this.coverage = <CoverageSelected>this.patientCoverageItem.get('planSelected').value;

    this.coverageSelected = <MedicalCoverageSelected>this.patientCoverageItem.get('coverageSelected').value ? <MedicalCoverageSelected>this.patientCoverageItem.get('coverageSelected').value : null;
    console.log("coverage")
    if (this.coverageSelected) {
      this.coverage.startDate = this.coverageSelected.startDate ? this.coverageSelected.startDate : '';
      this.coverage.endDate = this.coverageSelected.endDate ? this.coverageSelected.endDate : '';
      this.address = this.patchAddressValues();
      this.contact = this.patchContactValues();
    }
  }

  subscribeChanges() {
    this.patientCoverageItem.valueChanges
      .pipe(debounceTime(50), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(values => {

        this.coverageSelected = <MedicalCoverageSelected>this.patientCoverageItem.get('coverageSelected').value;
        this.coverage = <CoverageSelected>this.patientCoverageItem.get('planSelected').value;
        this.coverage.startDate = this.coverageSelected.startDate;
        this.coverage.endDate = this.coverageSelected.endDate;
        this.coverage.remarks = values.remarks;
        this.coverage.paymentRemarks = values.planSelected.paymentRemarks ? values.planSelected.paymentRemarks : '-';
        this.coverage.registrationRemarks = values.planSelected.registrationRemarks ? values.planSelected.registrationRemarks : '-';
        this.coverage.clinicRemarks = values.planSelected.clinicRemarks ? values.planSelected.clinicRemarks : '-';

        this.address = this.patchAddressValues();
        this.contact = this.patchContactValues();

        // console.log("Coverage values changed: ", this.coverage);
      });
  }

  patchAddressValues() {

    let address = this.patientCoverageItem.get('coverageSelected').value.address;

    const tempAdd = (Object.keys(address).length !== 0 && address !== undefined && address !== null) ? address : new Address('', '', '');

    const addString = ((tempAdd.address && tempAdd.address.length > 0) || (tempAdd.postalCode && tempAdd.postalCode.length > 0)) ? tempAdd.address + ' ' + tempAdd.postalCode : '-';

    return addString;
  }

  patchContactValues() {

    let cont = this.patientCoverageItem.get('coverageSelected').value.contacts;
    let contact;

    if (cont) {
      contact = (cont.length > 0) ? new ContactPerson(
        this.returnValueOrDash(cont[0].name),
        this.returnValueOrDash(cont[0].title),
        this.returnValueOrDash(cont[0].mobileNumber),
        this.returnValueOrDash(cont[0].directNumber),
        this.returnValueOrDash(cont[0].faxNumber),
        this.returnValueOrDash(cont[0].email))
        : new ContactPerson('-', '-', '-', '-', '-', '-');
    } else {
      contact = new ContactPerson('-', '-', '-', '-', '-', '-');
    }
    // console.log("CONTACT: ", contact);
    return contact;
  }

  returnValueOrDash(string) {
    return string ? string : '-';
  }
}

