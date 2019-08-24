import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-consultation-patient-document',
    templateUrl: './consultation-patient-document.component.html',
    styleUrls: ['./consultation-patient-document.component.scss']
})
export class ConsultationPatientDocumentComponent implements OnInit {
    rows = [];
    loadingIndicator = false;
    reorderable = true;

    columns = [
        { name: 'No' },
        { name: 'Document Title' },
        { name: 'Report By' },
        { name: 'Document Type' },
        { name: 'Attachments' },
        { name: 'Date Added' }
    ];

    constructor() {
        this.rows = dummyData;
    }

    ngOnInit() {}
}

const dummyData = [
    {
        no: 0,
        documentTitle: 'Dodson Sims',
        reportBy: 'Melanie Dillard',
        documentType: '',
        attachements: '',
        dateAdded: '22/11/2015'
    },
    {
        no: 1,
        documentTitle: 'Nadine Gallagher',
        reportBy: 'Katie Barber',
        documentType: '',
        attachements: '',
        dateAdded: '24/07/2015'
    },
    {
        no: 2,
        documentTitle: 'Juliette Vinson',
        reportBy: 'Janell Tate',
        documentType: '',
        attachements: '',
        dateAdded: '20/08/2017'
    },
    {
        no: 3,
        documentTitle: 'Francis Norman',
        reportBy: 'Effie Herrera',
        documentType: '',
        attachements: '',
        dateAdded: '20/04/2014'
    },
    {
        no: 4,
        documentTitle: 'Mcintyre Watts',
        reportBy: 'Stuart Hines',
        documentType: '',
        attachements: '',
        dateAdded: '24/03/2015'
    }
];
