import { VitalService } from './../../../../services/vital.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { LoggerService } from './../../../../services/logger.service';
import { AlertService } from '../../../../services/alert.service';
import { IOption } from 'ng-select';
import { ApiPatientVisitService } from '../../../../services/api-patient-visit.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { StoreService } from '../../../../services/store.service';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';

@Component({
  selector: 'app-vital-trend',
  templateUrl: './vital-trend.component.html',
  styleUrls: ['./vital-trend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VitalTrendComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() vitalTabs: TabsetComponent;
  @Input() refresh: boolean;
  // lineChart
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public lineChartDataSet: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType = 'line';

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  vitals = [
    { value: '0', label: 'BP' },
    { value: '1', label: 'Height' },
    { value: '2', label: 'Weight' },
    { value: '3', label: 'Bmi' },
    { value: '4', label: 'Temp' },
    { value: '5', label: 'Pulse' },
    { value: '6', label: 'Resp' }
    // { value: '7', label: 'SaO2' }
  ];

  private times: any[] = [];
  private vitalData: any[] = [];
  private diastolic: any[] = [];
  private systolic: any[] = [];
  private weight: any[] = [];
  private height: any[] = [];
  private bmi: any[] = [];
  private temp: any[] = [];
  private pulse: any[] = [];
  private resp: any[] = [];
  private sa02: any[] = [];

  isBp: boolean;

  vitalSelected = '0';

  exit: boolean;

  @Output() exitGraph = new EventEmitter<boolean>();

  constructor(
    private eRef: ElementRef,
    private apiPatientVisitService: ApiPatientVisitService,
    private store: StoreService,
    private alertService: AlertService,
    private logger: LoggerService,
    private vitalService: VitalService
  ) {}

  ngOnInit() {
    this.getPastVitals();

    console.log('OPEN TABSET');
    if (this.refresh) {
      console.log('REFRESHING');
      this.refresh = false;
    } else {
      console.log('NO REFRESHING');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes', changes);

    console.log('refresh: ', changes.refresh.currentValue);

    if (changes.refresh.currentValue) {
      // this.getPastVitals();
      this.vitalService.getPastVitals();
      this.refresh = false;
    }
  }

  getPastVitals() {
    // this.apiPatientVisitService.listVital(this.store.getPatientId()).subscribe(
    //   data => {
    //     this.logger.info('VITALS', data);
    //     if (data) {
    //       this.vitalData = data.payload;
    //       this.massageData(this.vitalData);
    //       this.vitalSelected = '3';
    //       this.generateBmiChart();
    //     }
    //   },
    //   err => this.alertService.error(JSON.stringify(err))
    // );

    this.vitalService.getObservableVitalData().subscribe(val => {
      console.log('Observable Vital Data', val);
      if (val && val.length > 0) {
        this.vitalData = val;
        this.massageData(this.vitalData);
        this.vitalSelected = '3';
        this.generateBmiChart();
      }
    });

    // this.vitalData = this.vitalService.getVitalData();
    // this.massageData(this.vitalData);
    // this.vitalSelected = '3';
    // this.generateBmiChart();
  }

  massageData(data: any[]) {
    const tempTimes = [];
    const tempDiastolic = [];
    const tempSystolic = [];
    const tempWeight = [];
    const tempHeight = [];
    const tempBmi = [];
    const tempTemp = [];
    const tempPulse = [];
    const tempResp = [];
    const tempSa02 = [];

    this.logger.info('Massage data', data);
    data.map((value, index) => {
      tempTimes.push(moment(value.takenTime, 'DD-MM-YYYYTHH:mm:ss').format('DD-MM-YY HH:mm'));
      tempDiastolic.push(value.bp.diastolic);
      tempSystolic.push(value.bp.systolic);
      tempWeight.push(value.weight);
      tempHeight.push(value.height);
      tempBmi.push(value.bmi);
      tempTemp.push(value.temperature);
      tempResp.push(value.respiration);
      tempSa02.push(value.sa02);
      tempPulse.push(value.pulse);
    });

    this.times = tempTimes;
    this.diastolic = tempDiastolic;
    this.systolic = tempSystolic;
    this.weight = tempWeight;
    this.height = tempHeight;
    this.bmi = tempBmi;
    this.temp = tempTemp;
    this.resp = tempResp;
    this.sa02 = tempSa02;
    this.pulse = tempPulse;

    this.logger.info('Vital Times', tempTimes);
    this.logger.info('Vital tempDiastolic', tempDiastolic);
    this.logger.info('Vital tempSystolic', tempSystolic);
    this.logger.info('Vital LineChart', this.lineChartData);
  }

  updateChartData(data: any[], label: string) {
    return { data, label };
  }

  //

  updateTime(times: any[]) {
    try {
      this.chart.chart.data.labels = times;
      this.lineChartLabels = times;
      if (this.isBp) {
        this.chart.chart.labels = times;
        this.chart.labels = times;
      }
      this.chart.chart.update();
    } catch (error) {}
  }

  generateBpChart() {
    this.lineChartDataSet = [
      this.updateChartData(this.diastolic, 'Diastolic'),
      this.updateChartData(this.systolic, 'Systolic')
    ];
    this.isBp = true;
    // this.lineChartLabels = times;
    this.logger.info('bp', this.lineChartData);
    this.updateTime(this.times);
  }
  generateTempChart() {
    this.lineChartData = [this.updateChartData(this.temp, 'Temp')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }
  generateWeightChart() {
    this.lineChartData = [this.updateChartData(this.weight, 'Weight')];

    // this.lineChartLabels = times;
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }
  generateHeightChart() {
    this.lineChartData = [this.updateChartData(this.height, 'Height')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }

  generateBmiChart() {
    this.lineChartData = [this.updateChartData(this.bmi, 'BMI')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }
  generatePulseChart() {
    this.lineChartData = [this.updateChartData(this.pulse, 'Pulse')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }
  generateRespirationChart() {
    this.lineChartData = [this.updateChartData(this.resp, 'Resp')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }
  generateSa02Chart() {
    this.lineChartData = [this.updateChartData(this.sa02, 'SaO2')];
    this.logger.info(this.lineChartData);
    this.updateTime(this.times);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    // if (
    //   event.target.textContent === 'VITAL TRENDS' ||
    //   event.target.nodeName === 'CANVAS' ||
    //   event.path[4].id === 'vitalTrendSelect' ||
    //   event.path[7].nodeName === 'APP-VITAL-TREND'
    // ) {
    //   this.selectTab(1);
    // } else {
    //   this.selectTab(0);
    // }
    // if (this.eRef.nativeElement.contains(event.target)) {
    //   console.log('======= a) inside VITAL TRENDS ======== :');
    //   console.log('a) event:  ', event);
    //   console.log('a) event.target:  ', event.target);
    // } else {
    //   console.log('======= b) OUTSIDE VITAL TRENDS ======== : ');
    //   console.log('b) event:  ', event);
    //   console.log('b) event.target:  -', event.target, '-');
    // }
  }

  selectTab(tab_id: number) {
    this.vitalTabs.tabs[tab_id].active = true;
  }

  onVitalOptionSelected(option) {
    this.logger.info('Vital Trend', option);
    this.isBp = false;
    switch (option.value) {
      case '0':
        this.logger.info('BP');
        this.generateBpChart();
        break;
      case '1':
        this.logger.info('Height');
        this.generateHeightChart();
        break;
      case '2':
        this.logger.info('Weight');
        this.generateWeightChart();
        break;
      case '3':
        this.logger.info('BMI');
        this.generateBmiChart();
        break;
      case '4':
        this.logger.info('Temp');
        this.generateTempChart();
        break;
      case '5':
        this.logger.info('Pulse');
        this.generatePulseChart();
        break;
      case '6':
        this.logger.info('Resp');
        this.generateRespirationChart();
        break;
      case '7':
        this.logger.info('SaO2');
        this.generateSa02Chart();
        break;
      default:
        break;
    }
  }
}
