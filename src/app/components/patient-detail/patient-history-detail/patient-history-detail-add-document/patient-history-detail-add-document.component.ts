import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-patient-history-detail-add-document',
  templateUrl: './patient-history-detail-add-document.component.html',
  styleUrls: ['./patient-history-detail-add-document.component.scss']
})
export class PatientHistoryDetailAddDocumentComponent implements OnInit {
  @Input()
  uploader: FileUploader;
  @Input()
  formGroup: FormGroup;
  title: string;
  queueLength = 0;
  totalSize = 0;
  names = [];

  constructor(private fb: FormBuilder, public bsModalRef: BsModalRef) {}

  ngOnInit() {
    const items = this.formGroup.get('itemArray') as FormArray;
    this.names = items.value.filter(item => item.itemType === 'LABORATORY').map(item => item.name).map(name => {
      return {
        value: name,
        label: name
      };
    });
    this.names.push({ value: 'OTHER', label: 'Other' });
    this.refreshNewDocumentsArray();
  }

  fileUpload(event) {
    this.updateNewDocumentsArray();
  }

  refreshNewDocumentsArray() {
    const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
    while (newDocumentsArray.length) {
      newDocumentsArray.removeAt(0);
    }

    this.queueLength = this.uploader.queue.length;
    this.totalSize = 0;

    this.uploader.queue.forEach(document => {
      const doc: any = document; //cast and avoid error on doc.description
      newDocumentsArray.push(
        this.fb.group({
          names: { value: this.names },
          name: this.names.length === 1 ? 'OTHER' : '',
          document: doc.file.name,
          description: doc.description || '',
          type: doc.file.type,
          size: doc.file.size,
          fileId: doc.fileId || ''
        })
      );
      this.totalSize += document.file.size;
    });
  }

  updateNewDocumentsArray() {
    const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
    for (let i = this.queueLength; i < this.uploader.queue.length; i++) {
      const document: any = this.uploader.queue[i]; //cast to `any` and avoid error on document.description
      newDocumentsArray.push(
        this.fb.group({
          names: { value: this.names },
          name: this.names.length === 1 ? 'OTHER' : '',
          document: document.file.name,
          description: document.description || '',
          type: document.file.type,
          size: document.file.size,
          fileId: document.fileId || ''
        })
      );
      this.totalSize += document.file.size;
    }

    this.queueLength = this.uploader.queue.length;
  }

  onDelete(form: FormGroup, index: number) {
    const document = this.uploader.queue[index];

    this.uploader.removeFromQueue(document);
    this.queueLength = this.uploader.queue.length;
    this.totalSize -= document.file.size;

    form.patchValue({
      isDelete: true,
      deleteIndex: index
    });

    const formArray = form.parent as FormArray;
    formArray.removeAt(index);
  }

  onSave() {
    this.uploader.uploadAll();
    this.bsModalRef.hide();
  }
}
