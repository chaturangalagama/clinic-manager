// General Libraries
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// Services
import { AlertService } from './../../../services/alert.service';
import { DISPLAY_DATE_FORMAT } from './../../../constants/app.constants';
import { ApiPatientVisitService } from './../../../services/api-patient-visit.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-consultation-documents',
  templateUrl: './consultation-documents.component.html',
  styleUrls: ['./consultation-documents.component.scss']
})
export class ConsultationDocumentsComponent implements OnInit {
  @Input() needRefresh: Subject<boolean>;

  documents: any;
  originalFlatDocuments: any[];
  flatDocuments: any[];
  pageLimit = 25;

  consultationDocument: FormGroup;
  // dateRange: FormControl;

  constructor(
    private apiPatientVisitService: ApiPatientVisitService,
    private store: StoreService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.consultationDocument = this.fb.group({
      searchKey: '',
      dateRange: ''
    });

    this.subscribeChange();

    this.loadData();

    this.needRefresh.subscribe(value => {
      console.log('CONSULTATION-DOCUMENTS: ', value);
      this.loadData();
    });
  }

  subscribeChange() {
    this.consultationDocument.get('dateRange').valueChanges.subscribe(data => {
      console.log('Date Range Data', data);
      if (data && data.length > 0) {
        const startDate = moment(data[0]).format(DISPLAY_DATE_FORMAT);
        const endDate = moment(data[1]).format(DISPLAY_DATE_FORMAT);

        this.loadData(startDate, endDate);
      }
    });

    this.consultationDocument.get('searchKey').valueChanges.subscribe(data => {
      console.log('Search Key', data);
      this.flatDocuments = this.originalFlatDocuments.filter(
        item => item.description.includes(data) || item.fileName.includes(data) || item.name.includes(data)
      );
    });
  }

  loadData(startDate = '', endDate = '') {
    const patientId = this.store.getPatientId();
    if (!patientId) {
      return;
    }
    if (startDate === '') {
      startDate = moment()
        .subtract(6, 'months')
        .format(DISPLAY_DATE_FORMAT);
    }
    if (endDate === '') {
      endDate = moment().format(DISPLAY_DATE_FORMAT);
    }

    this.apiPatientVisitService.listAllFiles(patientId, startDate, endDate).subscribe(
      res => {
        console.log(res);
        this.documents = res.payload;
        this.populateData();
      },
      err => console.log(err)
    );
  }

  populateData() {
    this.flatDocuments = [];
    this.documents.forEach(data => {
      const { fileMetaData, listType, patientVisitId, localDate } = data;
      if (fileMetaData && fileMetaData.length > 0) {
        console.log('Doc', ...fileMetaData);
        fileMetaData.map(item => {
          item['listType'] = listType.toLowerCase();
          item['date'] = '';
          if (listType === 'PATIENT') {
            item['downloadId'] = this.store.getPatientId();
          } else {
            item['downloadId'] = patientVisitId;
            item['date'] = localDate;
          }

          this.flatDocuments.push(item);
        });

        // this.flatDocuments=[...fileMetaData,...this.flatDocuments];
        this.originalFlatDocuments = this.flatDocuments;
      }
    });

    console.log('Flat Documents', this.flatDocuments);
  }

  onDownloadNewDocument(fileId, fileName, documentType, downloadId) {
    this.apiPatientVisitService.downloadDocument(downloadId, fileId).subscribe(
      res => {
        saveAs(res, fileName);
      },
      err => this.alertService.error(JSON.stringify(err))
    );
  }
}
