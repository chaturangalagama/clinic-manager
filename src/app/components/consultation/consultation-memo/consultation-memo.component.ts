import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consultation-memo',
  templateUrl: './consultation-memo.component.html',
  styleUrls: ['./consultation-memo.component.scss']
})
export class ConsultationMemoComponent implements OnInit {
  @Input() memo: FormControl;
  ckeConfig: any;
  codes: string[];
  constructor() { }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'divarea'
    };
  }
}
