import { SelectedPlan, SelectedPlans, CapPerVisit, Copayment, Address, CoverageSelected, ContactPerson, MedicalCoverageSelected } from './../objects/MedicalCoverage';
import {
  Insurance,
  PolicyHolder,
  CoveragePlan,
  Contact,
} from './../objects/response/MedicalCoverageResponse';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class MedicalCoverageFormService {
  policyHolder: FormGroup;
  coveragePlan: FormGroup;
  contacts: FormArray;

  constructor(private fb: FormBuilder) { }

  populateForm(medicalCoverage: Insurance) {
    const { policyHolder, coveragePlan, contacts } = medicalCoverage;
    return this.fb.group({
      policyHolder: this.createPolicyHolder(policyHolder),
      coveragePlan: this.createCoveragePlan(coveragePlan),
      contacts: this.createContacts(contacts)
    });
  }

  createPolicyHolder(policyHolder?: PolicyHolder) {
    if (!policyHolder) {
      policyHolder = new PolicyHolder();
    }

    return this.fb.group({
      id: policyHolder.id,
      identificationNumber: this.fb.group({
        idType: policyHolder.identificationNumber.idType,
        number: policyHolder.identificationNumber.number
      }),
      name: policyHolder.name,
      medicalCoverageId: policyHolder.medicalCoverageId,
      planId: policyHolder.planId,
      patientCoverageId: policyHolder.patientCoverageId,
      specialRemarks: policyHolder.specialRemarks,
      status: policyHolder.status,
      startDate: policyHolder.startDate,
      endDate: policyHolder.endDate,
      costCenter: policyHolder.costCenter
    });
  }

  createCoveragePlan(coveragePlan?: CoveragePlan) {
    if (!coveragePlan) {
      coveragePlan = new CoveragePlan();
    }
    console.log('coverage Plan', coveragePlan);
    const { capPerVisit, capPerWeek, capPerMonth, capPerYear, capPerLifeTime, copayment } = coveragePlan;

    return this.fb.group({
      id: coveragePlan.id,
      name: coveragePlan.name,
      capPerVisit: this.fb.group({ visits: capPerVisit.visits, limit: capPerVisit.limit }),
      capPerWeek: this.fb.group({ visits: capPerWeek.visits, limit: capPerWeek.limit }),
      capPerMonth: this.fb.group({ visits: capPerMonth.visits, limit: capPerMonth.limit }),
      capPerYear: this.fb.group({ visits: capPerYear.visits, limit: capPerYear.limit }),
      capPerLifeTime: this.fb.group({ visits: capPerLifeTime.visits, limit: capPerLifeTime.limit }),
      copayment: this.fb.group({ value: copayment.value, paymentType: copayment.paymentType }),
      limitResetType: coveragePlan.limitResetType,
      code: coveragePlan.code,
      remarks: coveragePlan.remarks,
      clinicRemarks: coveragePlan.clinicRemarks,
      registrationRemarks: coveragePlan.registrationRemarks,
      paymentRemarks: coveragePlan.paymentRemarks,
      //   excludedClinics: coveragePlan.excludedClinics,
      excludeAllByDefault: coveragePlan.excludeAllByDefault,
      includedMedicalServiceSchemes: coveragePlan.includedMedicalServiceSchemes,
      excludedMedicalServiceSchemes: coveragePlan.excludedMedicalServiceSchemes
      //allowedRelationship: coveragePlan.allowedRelationship
    });
  }

  createCoverageSelectedFB(policyHolder): FormGroup {

    const p = policyHolder;
    const formGroup = this.fb.group({
      costCenter: p.costCenter,
      id: p.id,
      identificationNumber: this.fb.group({
        idType: p.identificationNumber.idType,
        number: p.identificationNumber.number
      }),
      medicalCoverageId: p.medicalCoverageId,
      name: p.name,
      patientCoverageId: p.patientCoverageId,
      planId: p.planId,
      specialRemarks: p.specialRemarks,
      startDate: p.startDate,
      status: p.status,
      endDate: p.endDate
    });

    return formGroup;
  }

  createSelectedPlan(isSelected, policyHolder, planRows, medicalCoverageSelected,coveragePlan,key,isNew){
    return new SelectedPlan(
      isSelected,
      policyHolder.medicalCoverageId,
      policyHolder.patientCoverageId,
      planRows,
      policyHolder.planId,
      medicalCoverageSelected,
      coveragePlan,
      policyHolder.costCenter,
      key,
      policyHolder.startDate,
      policyHolder.endDate,
      isNew,
      policyHolder.specialRemarks
    );
  }

  createContacts(contacts?: Array<Contact>) {
    const tempFormArray = this.fb.array([]);

    if (!contacts) {
      console.log('init contacts');
      contacts = new Array<Contact>();
      contacts.push(new Contact());
    }

    console.log('contacts', contacts);

    contacts.forEach(element => {
      const tempFormGroup = this.fb.group({
        name: element.name,
        title: element.title,
        directNumber: element.directNumber,
        faxNumber: element.faxNumber,
        email: element.email
      });

      tempFormArray.push(tempFormGroup);
    });
    return tempFormArray;
  }

  patchMCValuesToPlans(values){
    const tempPlans: SelectedPlans[] = [];

    values.forEach((selectedItem, index) => {
      const capPerVisit: CapPerVisit = {
        visits: selectedItem.planSelected.capPerVisit['visits'],
        limit: selectedItem.planSelected.capPerVisit['limit']
      };

      const capPerWeek: CapPerVisit = {
        visits: selectedItem.planSelected.capPerWeek['visits'],
        limit: selectedItem.planSelected.capPerWeek['limit']
      };

      const capPerMonth: CapPerVisit = {
        visits: selectedItem.planSelected.capPerMonth.visits,
        limit: selectedItem.planSelected.capPerMonth.limit
      };

      const capPerYear: CapPerVisit = {
        visits: selectedItem.planSelected.capPerYear.visits,
        limit: selectedItem.planSelected.capPerYear.limit
      };

      const capPerLifeTime: CapPerVisit = {
        visits: selectedItem.planSelected.capPerLifeTime.visits,
        limit: selectedItem.planSelected.capPerLifeTime.limit
      };

      const copayment: Copayment = {
        value: selectedItem.planSelected.copayment.value,
        paymentType: selectedItem.planSelected.copayment.paymentType
      };

      const address: Address = {
        attentionTo: selectedItem.coverageSelected.address.attentionTo,
        street: selectedItem.coverageSelected.address.street,
        unit: selectedItem.coverageSelected.address.unit,
        postalCode: selectedItem.coverageSelected.address.postalCode
      };

      const coveragePlan: CoverageSelected = {
        id: selectedItem.planSelected.id,
        name: selectedItem.planSelected.name,
        capPerVisit: capPerVisit,
        capPerWeek: capPerWeek,
        capPerMonth: capPerMonth,
        capPerYear: capPerYear,
        capPerLifeTime: capPerLifeTime,
        copayment: copayment,
        limitResetType: '',
        code: selectedItem.planSelected.code,
        remarks: 'testing',
        excludedClinics: [],
        includedMedicalServiceSchemes: [],
        excludedMedicalServiceSchemes: [],
        allowedRelationship: []
      };

      const contactArray = selectedItem.coverageSelected.contacts;
      const contactPersons: ContactPerson[] = [];
      contactArray.forEach(contact => {
        const contactPerson: ContactPerson = {
          name: contact.name,
          title: contact.title,
          directNumber: contact.directNumber,
          mobileNumber: contact.mobileNumber,
          faxNumber: contact.faxNumber,
          email: contact.email
        };

        contactPersons.push(contactPerson);
      });

      const medicalCoverage: MedicalCoverageSelected = {
        id: selectedItem.coverageSelected.id,
        name: selectedItem.coverageSelected.name,
        code: selectedItem.coverageSelected.code,
        accountManager: selectedItem.coverageSelected.accountManager,
        type: selectedItem.coverageSelected.type,
        startDate: selectedItem.coverageSelected.startDate,
        endDate: selectedItem.coverageSelected.endDate,
        creditTerms: selectedItem.coverageSelected.creditTerms,
        website: selectedItem.coverageSelected.website,
        trackAttendance: selectedItem.coverageSelected.trackAttendance,
        usePatientAddressForBilling: selectedItem.coverageSelected.usePatientAddressForBilling,
        medicineRefillAllowed: selectedItem.coverageSelected.medicineRefillAllowed,
        showDiscount: selectedItem.coverageSelected.showDiscount,
        showMemberCard: selectedItem.coverageSelected.showMemberCard,
        address: selectedItem.coverageSelected.address,
        contacts: contactPersons,
        coveragePlans: []
      };

      const temp: SelectedPlans = {
        isSelected: false,
        coverageSelected: medicalCoverage,
        employeeNo: selectedItem.employeeNo,
        planRows: '',
        planSelected: coveragePlan
      };

      tempPlans.push(temp);
    });

    return tempPlans;
  }
}
