// Libraries
import { Component, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

// Services
import { StoreService } from './../../../../services/store.service';
import { ConsultationFormService } from './../../../../services/consultation-form.service';
import { CaseChargeFormService } from './../../../../services/case-charge-form.service';
import { filter, distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-consultation-search',
  templateUrl: './consultation-search.component.html',
  styleUrls: ['./consultation-search.component.scss']
})
export class ConsultationSearchComponent implements OnInit {
  @Input() itemsFormArray: FormArray;
  @Output() onFirstChargeItemDetailsAdded = new EventEmitter<FormArray>();

  itemTypeOptions: Array<any> = [
    { label: 'Medical Test', value: 'LABORATORY' },
    { label: 'Implants', value: 'IMPLANTS' },
    { label: 'Consultation', value: 'CONSULTATION' },
    { label: 'Medical Service', value: 'SERVICE' },
    { label: 'Drug', value: 'DRUG' },
    { label: 'Consumable', value: 'CONSUMABLE' },
    { label: 'Vaccination', value: 'VACCINATION' }
  ];

  searchFormGroup: FormGroup;

  searchByCodeField: FormControl;
  searchByNameField: FormControl;
  searchByTypeField: FormControl;
  codesTypeahead = new Subject<string>();

  items = [];
  rows = [];
  selected = [];

  public event: EventEmitter<any> = new EventEmitter();

  constructor(private store: StoreService, private fb: FormBuilder) {}

  ngOnInit() {
    this.items = this.store.activeChargeItemList;
    this.rows = this.items;

    console.log('DRUG ROW: ', this.rows);

    this.initSearchFields();
  }

  initSearchFields() {
    this.searchByCodeField = this.fb.control('');
    this.searchByNameField = this.fb.control('');
    this.searchByTypeField = this.fb.control('');

    this.searchByCodeField.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        map(data => {
          data = data.replace(/[^a-zA-Z0-9 ]/g, '');
          this.searchByCodeField.setValue(data, { emitEvent: false });
          return data;
        })
      )
      .subscribe(data => {
        this.updateFilter();
      });

    this.searchByNameField.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        map(data => {
          data = data.replace(/[^a-zA-Z0-9 ]/g, '');
          this.searchByNameField.setValue(data, { emitEvent: false });
          return data;
        })
      )
      .subscribe(data => {
        this.updateFilter();
      });

    this.searchByTypeField.valueChanges.pipe(distinctUntilChanged()).subscribe(data => this.updateFilter());
  }

  updateFilter() {
    this.rows = [
      ...this.items.filter(
        item =>
          (<string>item.item.name).toLowerCase().includes(this.searchByNameField.value.toLowerCase()) &&
          (<string>item.item.code).toLowerCase().includes(this.searchByCodeField.value.toLowerCase()) &&
          (this.searchByTypeField.value ? item.item.itemType === this.searchByTypeField.value : true)
      )
    ];
  }

  onAddBtnClicked() {
    if (this.selected.length > 0) {
      this.event.emit(this.selected);
    }
  }

  onCancelBtnClicked() {
    this.event.emit('close');
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    console.log('this.selected: ', this.selected);
  }

  onActivate(event) {}
}
