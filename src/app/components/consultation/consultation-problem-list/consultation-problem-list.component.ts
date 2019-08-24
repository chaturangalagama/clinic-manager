import { Subject } from 'rxjs';
import { PatientNoteAdd } from './../../../objects/request/PatientNoteAdd';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DB_FULL_DATE_FORMAT } from './../../../constants/app.constants';
import { AlertService } from './../../../services/alert.service';
import { StoreService } from './../../../services/store.service';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { Component, OnInit, Input } from '@angular/core';
import { PatientNote } from '../../../objects/response/PatientNote';
import * as moment from 'moment';

@Component({
  selector: 'app-consultation-problem-list',
  templateUrl: './consultation-problem-list.component.html',
  styleUrls: ['./consultation-problem-list.component.scss']
})
export class ConsultationProblemListComponent implements OnInit {
  @Input() needRefresh: Subject<boolean>;
  patientNotesForm: FormGroup;

  patientNotes: Array<PatientNote>;
  patientNotesGrouped;
  objectKeys = Object.keys;

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private store: StoreService,
    private alert: AlertService,
    private fb: FormBuilder
  ) {
    this.patientNotes = [];
  }

  ngOnInit() {
    this.patientNotesForm = this.fb.group({
      range: undefined,
      note: ['', Validators.required],
      type: [''],
      date: [''],
      searchKeyword: ''
    });

    this.getPatientNotes();

    this.subscribeOnChange();
  }

  getPatientNotes() {
    console.log('store id', this.store.getPatientId());
    this.apiCmsManagementService.listPatientNotes(this.store.getPatientId()).subscribe(
      res => {
        console.log("res notes: ",res);
        if (res.payload && res.payload['noteDetails'].length > 0) {
          const { noteDetails } = res.payload;
          this.patientNotes = noteDetails;
          this.refreshData(true);

          console.log('Patient Notes', this.patientNotes);
          console.log('Patient Notes', this.patientNotesGrouped);
        }
      },
      err => {
        this.alert.error(err);
      }
    );
  }

  refreshData(isSortNeeded = false, newData?) {
    if (isSortNeeded) {
      this.patientNotes.sort(this.compareValues('addedDateTime', 'desc'));
    }
    if (newData) {
      this.patientNotesGrouped = this.groupDataByYear(this.patientNotesGrouped);
    } else {
      this.patientNotesGrouped = this.groupDataByYear(this.patientNotes);
    }

    this.patientNotesGrouped.sort(this.compareValues('key', 'desc'));
  }

  subscribeOnChange() {
    this.patientNotesForm.controls['searchKeyword'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(item => {
        console.log('search keyword: ', item);
        this.filterData();
      });

    this.patientNotesForm.controls['range'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(item => {
        console.log('range: ', item);
        this.filterData();
      });

    this.needRefresh.subscribe(value => {
      if (value) {
        this.getPatientNotes();
        this.refreshData(true);
      }
    });
  }

  filterData() {
    const keyword = this.patientNotesForm.get('searchKeyword').value;
    const dateRange = this.patientNotesForm.get('range').value;
    console.log('Search Input', this.patientNotes);
    const result = this.patientNotes.filter(element => {
      let isValidDate = true;
      let isValidKeyword = true;
      const addedTime = moment(element.addedDateTime, DB_FULL_DATE_FORMAT);

      if (dateRange) {
        const startDate = moment(dateRange[0]);
        const endDate = moment(dateRange[1]);

        // isValidDate = addedTime.isBetween(startDate, endDate, null, '[]');
        isValidDate = addedTime.isSameOrAfter(startDate.subtract(1, 'days')) && addedTime.isSameOrBefore(endDate);
      }

      if (keyword) {
        isValidKeyword = element.note.toLowerCase().includes(keyword.toLowerCase());
      }

      return isValidKeyword && isValidDate;
    });
    console.log('Search Result', result);
    this.patientNotesGrouped = result;
    this.refreshData(false, result);
  }

  sortDataDescending() {
    this.patientNotes.sort((a, b) => {
      
      if(a && b){
        const firstDate = moment(a.addedDateTime, DB_FULL_DATE_FORMAT);
        const secondDate = moment(b.addedDateTime, DB_FULL_DATE_FORMAT);

        if (firstDate.isAfter(secondDate)) {
          return -1;
        }

        if (firstDate.isBefore(secondDate)) {
          return 1;
        }

        return 0;
      }
    });
  }

  // function for dynamic sorting
  compareValues(key, order = 'asc') {
    if (key === 'addedDateTime') {
      this.sortDataDescending();
    } else {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        let varA;
        let varB;

        varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
      };
    }
  }

  groupDataByYear(objectArray) {
    const groupedData = objectArray.reduce((acc, obj) => {
      const year = moment(obj.addedDateTime, DB_FULL_DATE_FORMAT).year();

      // const key = obj[property];
      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(obj);
      return acc;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedData).map(key => ({ key, value: groupedData[key] }));
  }

  onAddNote() {
    const note = new PatientNoteAdd(
      this.patientNotesForm.get('note').value,
      this.store.getUser().context['cms-user-id'],
      moment().format(DB_FULL_DATE_FORMAT)
    );
    if (note) {
      this.apiCmsManagementService.addPatientNote(this.store.getPatientId(), note).subscribe(
        res => {
          console.log('Add Note', res.payload);
          this.patientNotesForm.get('note').patchValue('');
          if (res.payload && res.payload['noteDetails']) {
            this.patientNotes = res.payload['noteDetails'];
            this.refreshData(true);
          }
        },
        err => {}
      );
    }
  }
}
