import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-patient-detail-add-document',
  templateUrl: './patient-detail-add-document.component.html',
  styleUrls: ['./patient-detail-add-document.component.scss']
})
export class PatientDetailAddDocumentComponent implements OnInit {
  @Input()
  uploader: FileUploader;
  @Input()
  formGroup: FormGroup;
  title: string;
  queueLength = 0;
  totalSize = 0;
  isDescriptionFilled = false;

  constructor(private fb: FormBuilder, public bsModalRef: BsModalRef) {}

  ngOnInit() {
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
    this.isDescriptionFilled = false;
    this.totalSize = 0;

    this.uploader.queue.forEach(document => {
      const doc: any = document; //cast and avoid error on doc.description
      const newDocument = this.fb.group({
        document: doc.file.name,
        description: [doc.description || '', Validators.required],
        type: doc.file.type,
        size: doc.file.size,
        fileId: ''
      });
      newDocument.get('description').valueChanges.subscribe(description => {
        if (!description) {
          this.isDescriptionFilled = false;
          return;
        }
        const numOfFilledDescriptions = newDocumentsArray.value.reduce(
          (sum, document) => (sum += document.description ? 1 : 0),
          0
        );
        if (numOfFilledDescriptions !== newDocumentsArray.value.length) {
          this.isDescriptionFilled = false;
        } else {
          this.isDescriptionFilled = true;
        }
      });
      newDocumentsArray.push(newDocument);
      this.totalSize += document.file.size;
    });
  }

  updateNewDocumentsArray() {
    this.isDescriptionFilled = false;

    const newDocumentsArray = this.formGroup.get('newDocumentsArray') as FormArray;
    for (let i = this.queueLength; i < this.uploader.queue.length; i++) {
      const document: any = this.uploader.queue[i]; //cast to `any` and avoid error on doc.description
      const newDocument = this.fb.group({
        document: document.file.name,
        description: [document.description || '', Validators.required],
        type: document.file.type,
        size: document.file.size,
        fileId: ''
      });
      newDocument.get('description').valueChanges.subscribe(description => {
        if (!description) {
          this.isDescriptionFilled = false;
          return;
        }
        const numOfFilledDescriptions = newDocumentsArray.value.reduce(
          (sum, document) => (sum += document.description ? 1 : 0),
          0
        );
        if (numOfFilledDescriptions !== newDocumentsArray.value.length) {
          this.isDescriptionFilled = false;
        } else {
          this.isDescriptionFilled = true;
        }
      });
      newDocumentsArray.push(newDocument);
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
