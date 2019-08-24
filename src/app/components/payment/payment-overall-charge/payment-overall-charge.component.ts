import { DisplayDollarPipe } from './../../../pipes/display-dollar.pipe';
import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-payment-overall-charge',
  templateUrl: './payment-overall-charge.component.html',
  styleUrls: ['./payment-overall-charge.component.scss']
})
export class PaymentOverallChargeComponent implements OnInit {
  @Input() overallChargeFormGroup: FormGroup;
  overallCharges;
  totalCharge = 0;
  totalGst = 0;
  totalCash = 0;
  totalCashGst = 0;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  formatToTitleCase(string) {
    return this.utilService.convertToTitleCaseUsingSpace(string);
  }
}
