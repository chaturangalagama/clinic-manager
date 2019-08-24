import { Router } from '@angular/router';
import { DISPLAY_DATE_FORMAT } from './../../../../constants/app.constants';
import { ApiCmsManagementService } from './../../../../services/api-cms-management.service';
import { PatientSearchComponent } from './../../patient/patient-search/patient-search.component';
import { AlertService } from './../../../../services/alert.service';
import { ApiPatientInfoService } from './../../../../services/api-patient-info.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { distinctUntilChanged, debounceTime, filter, tap,switchMap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-appointments-new',
  templateUrl: './appointments-new.component.html',
  styleUrls: ['./appointments-new.component.scss']
})
export class AppointmentsNewComponent implements OnInit {
  searchField: FormControl;
  searchName = new Subject<string>();
  loading = false;
  rows = [];
  selectedPatient;
  @Input() consultationFormGroup: FormGroup;
  constructor(
    private router: Router,
    private fb:FormBuilder,
    private apiPatientInfoService: ApiPatientInfoService,
    private alertService: AlertService,
    private apiCmsManagementService: ApiCmsManagementService
    ) { }

  ngOnInit() {
    this.searchField = new FormControl();
   this.onFilterInputChanged();
    // this.searchField.valueChanges
    //   .pipe(filter(term => {
    //     this.rows = [];
    //     //Filter and stop firing API if only one special char is inputted
    //     if (term.match(/[^a-zA-Z0-9 ]/g)) {
    //       const str = term.replace(/[^a-zA-Z0-9 ]/g, '');
    //       if (str.length < 1) {
    //         this.searchField.setValue(str);
    //         return false
    //       }
    //     }
    //     return term;
    //   }), distinctUntilChanged(), map(data => {
    //     // remove special char for API call
    //     data = data.replace(/[^a-zA-Z0-9 ]/g, '');
    //     this.searchField.setValue(data);
    //     return data
    //   }), debounceTime(400), switchMap(term => this.apiPatientInfoService.search(term)))
    //   .subscribe(
    //     data => {
    //       console.log('DATA', data);
    //       if (data) {
    //         const { payload } = data;
    //         const temp2 = payload.map(payload => {
    //           const d = {
    //             name: payload.name,
    //             phone: payload.contactNumber.number,
    //             dob: payload.dob,
    //             id: payload.userId.number,
    //             patientid: payload.id
    //           };
    //           return d;
    //           // return payload.name;
    //         });
    //         // push our inital complete list
    //         this.rows = temp2;
    //       }
    //       return data;
    //     },
    //     err => {
    //       this.alertService.error(JSON.stringify(err.error.message));
    //     }
    //   );
    // this chunk of code temporarily added in
    // once Appointment API is available, to be subjected to changes
    if(!this.consultationFormGroup)
    {
      this.consultationFormGroup = this.fb.group({
        purposeOfVisit:'',
        preferredDoctor:'',
        remarks:'',
        visitDate:'',
        time:''
      });
    }
  }

  onFilterInputChanged(){
    try{
        this.searchName
        .pipe(filter(term => {
            this.rows = [];

            console.log("term: ",term);

            if (term.match(/[^a-zA-Z0-9 ]/g)) {
              const str = term.replace(/[^a-zA-Z0-9 ]/g, '');
              if (str.length < 1) {
                this.searchField.setValue(str);
                console.log("returning false");
                return false
              }
            }
            return true;
          }),
          distinctUntilChanged((a,b) =>{
            return a===b;
          }), map(data => {
            data = data.replace(/[^a-zA-Z0-9 ]/g, '');
            this.searchField.setValue(data);
            console.log("data: ",data);
            return data
          }),
          debounceTime(400),
          switchMap(term => this.apiPatientInfoService.search(term)))
        .subscribe(
          data => {
            console.log('DATA', data);
            if (data) {
              const { payload } = data;
              const temp2 = payload.map(payload => {
                const d = {
                  name: payload.name,
                  phone: payload.contactNumber.number,
                  dob: payload.dob,
                  id: payload.userId.number,
                  patientid: payload.id
                };
                return d;
                // return payload.name;
              });
              // push our inital complete list
              this.rows = temp2;
            }
            return data;
          },
          err => {
            try{
              this.loading = false;
              // this.alertService.error(JSON.stringify(err.error.message));
            } catch(err){
              this.alertService.error(JSON.stringify(err.error.message));
            }
          }
        );
      }catch (err) {
        console.log('Search Coverage Error', err);
      }
  }

  addPatient() {
    this.router.navigate(['pages/patient/search']);
  }

}
