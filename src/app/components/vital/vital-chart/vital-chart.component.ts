import { FormControl, FormGroup } from '@angular/forms';
import {
  DB_FULL_DATE_TIMEZONE_NO_SPACE,
  DISPLAY_DATE_TIME_NO_SECONDS_FORMAT,
  DB_FULL_DATE_FORMAT_NO_SECOND
} from './../../../constants/app.constants';
import { StoreService } from './../../../services/store.service';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild, AfterViewInit, SimpleChanges, OnDestroy } from '@angular/core';
import { VitalConfiguration } from '../../../objects/response/VitalConfiguration';
import { VitalFormService } from '../../../services/vital-form.service';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { start } from 'repl';

@Component({
  selector: 'app-vital-chart',
  templateUrl: './vital-chart.component.html',
  styleUrls: ['./vital-chart.component.scss']
})
export class VitalChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  private fgDate: FormGroup;
  private vitalSelecteds: any[];
  private vitals: VitalConfiguration[];
  private vitalData: any;
  private processedData: any[];
  private timeData = [];

  private maxDate = new Date();

  private componentDestroyed: Subject<void> = new Subject();

  public lineChartType = 'line';
  public chartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            source: 'data'
          },
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'DD-MM-YYYY'
            }
          },
          distribution: 'series'
        }
      ]
    },
    elements: {
      line: {
        fill: false,
        spanGaps: true,
        steppedLine: true
      }
    }
  };

  chartLabels = ['January', 'February', 'Mar', 'April'];

  chartData: Array<any> = [];

  onChartClick(event) {}

  constructor(private store: StoreService, private vitalFormService: VitalFormService) {
    this.fgDate = new FormGroup({ dateRange: new FormControl() });
    this.fgDate.get('dateRange').patchValue(this.vitalFormService.getInitialDateRangeISO());

    // this.fgDate.get('dateRange').patchValue(['2018-12-30T10:23:53+08:00', '2019-01-30T10:23:53+08:00']);
  }

  ngOnInit() {
    // this.vitals = this.store.vitalConfigurations && [...this.store.vitalConfigurations];
    this.vitals = [];
    this.processedData = [];

    this.vitalFormService.populateData();
    this.vitalDataSubscription();
    this.vitalDataAvailableKeySubscription();

    this.vitalFormService.getaddVitalCompleted().subscribe(value => {
      if (value) {
        // Added successfully
        console.log('Vital Added Successfuly');
        this.vitalFormService.populateData();
      } else {
        // Added unsuccessfully
        console.log('Vital Added Unsuccessfuly');
      }
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  vitalDataSubscription() {
    this.vitalFormService.getVitalData().subscribe(data => {
      console.log('​VitalChartComponent -> vitalDataSubscription -> data', data);
      this.vitalData = data;
      this.transformData();
    });
  }

  vitalDataAvailableKeySubscription() {
    this.vitalFormService.getavailableDataKeys().subscribe(objectKeys => {
      this.vitals = objectKeys;
      if (!objectKeys || objectKeys.length < 1) {
        this.vitalSelecteds = [];
        this.chartData = [];
      }
      console.log('​VitalChartComponent -> vitalDataAvailableKeySubscription -> objectKeys', objectKeys);
    });
  }

  updateChartsData() {
    console.log('updateCharts()');

    setTimeout(() => {
      this.chart.ngOnChanges({} as SimpleChanges);
    }, 100);
  }

  onVitalOptionSelected(event) {
    if (event.length > 0) {
      this.chartData = [];
      event.map((_val, index) => {
        const val = _val.code;
        const tempData = this.processedData[val];

        console.log('​onVitalOptionSelected -> tempData', tempData);

        this.newDataPoint(tempData, val);
      });
    } else {
      try {
        this.chartData = [];
      } catch (e) {
        console.log('Error Removing Chart Variables ', e);
      }
    }
  }

  transformData() {
    if (this.vitals && this.processedData && this.vitalData) {
      this.vitals.map((_value, index) => {
        const value = _value.code;
        const tempData = this.getTimeSerieDataForChart(this.vitalData[value], value);

        console.log('​transformData -> this.processedData', this.processedData);
        this.processedData[value] = {};
        this.processedData[value] = tempData;
        // For Showing Table
        this.groupBy(this.vitalData[value], 'takenTime');
        // console.log('​transformData -> timeSeries', timeSeries);
      });

      // this.timeData = this.timeData;
      console.log('​processData -> this.processedData', this.timeData);
    } else {
      this.vitalData = [];
      this.vitals = [];
    }
  }

  getTimeSerieDataForChart(originalData, key = '') {
    return originalData.map(data => {
      return {
        x: data.takenTime && moment(data.takenTime, DB_FULL_DATE_TIMEZONE_NO_SPACE).format('YYYY-MM-DD'),
        y: data.value && data.value
      };
    });
  }

  groupBy(objectArray, property) {
    objectArray.forEach(element => {
      const key = moment(element[property], DB_FULL_DATE_TIMEZONE_NO_SPACE).format(DISPLAY_DATE_TIME_NO_SECONDS_FORMAT);
      console.log('​key', key);
      if (!this.timeData[key]) {
        this.timeData[key] = [];
      }

      this.timeData[key].push(element);
    });
  }

  getTimeKeys() {
    return Object.keys(this.timeData).sort(this.desDateSort);
  }

  desDateSort(a, b) {
    const dateA = moment(a, DISPLAY_DATE_TIME_NO_SECONDS_FORMAT);
    const dateB = moment(b, DISPLAY_DATE_TIME_NO_SECONDS_FORMAT);

    if (dateA.isBefore(dateB)) {
      return 1;
    }

    if (dateA.isAfter(dateB)) {
      return -1;
    }

    return 0;
  }

  getCurrentTimeData(timeKey, dataKey) {
    if (this.timeData) {
      const data = this.timeData[timeKey].find(element => element.code === dataKey.code);

      return data && data.value && data.value;
    }

    return '';
  }

  newDataPoint(dataArr = [100, 100, 100, 0], label) {
    console.log('​newDataPoint -> dataArr', dataArr);
    const tempLabels = [...this.chartLabels];
    this.chartLabels.length = 0;
    this.chartLabels = tempLabels;
    const tempChartData = [...this.chartData, { data: dataArr, label }];
    // this.chartData.length = 0;
    this.chartData = [];
    this.chartData = tempChartData;

    this.updateChartsData();

    console.log('​VitalChartComponent -> ngOnInit -> chartData', this.chartData);
  }

  searchVitals() {
    const mDateRange = this.fgDate.get('dateRange').value;
    if (mDateRange) {
      const startDate = moment(mDateRange[0]).format(DB_FULL_DATE_FORMAT_NO_SECOND);
      const endDate = moment(mDateRange[1]).format(DB_FULL_DATE_FORMAT_NO_SECOND);
      this.vitalFormService.populateData(startDate, endDate);
    }
  }
}
