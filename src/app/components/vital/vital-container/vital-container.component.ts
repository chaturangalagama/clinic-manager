import { VitalFormService } from './../../../services/vital-form.service';
import { VitalAddComponent } from './../vital-add/vital-add.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vital-container',
  templateUrl: './vital-container.component.html',
  styleUrls: ['./vital-container.component.scss']
})
export class VitalContainerComponent implements OnInit {
  @Input() viewOnly: boolean;

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private vitalFormService: VitalFormService) {}

  ngOnInit() {}

  addVital() {
    const initialState = {
      title: 'Add Vital'
    };

    this.bsModalRef = this.modalService.show(VitalAddComponent, { initialState, class: 'modal-xl' });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.modalService.onShow.subscribe(reason => {
      console.log('​VitalContainerComponent -> addVital -> reason', reason);
      this.vitalFormService.resetVitalSignFormArray();
    });
  }
}
