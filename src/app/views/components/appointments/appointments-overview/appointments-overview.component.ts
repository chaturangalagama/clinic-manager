import { AppointmentsNewComponent } from './../appointments-new/appointments-new.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Router } from '@angular/router';
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-appointments-overview',
  templateUrl: './appointments-overview.component.html',
  styleUrls: ['./appointments-overview.component.scss']
})
export class AppointmentsOverviewComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  bsModalRef: BsModalRef;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  isFilterHidden = true;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        // this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  activeDayIsOpen = true;

  constructor(private router: Router, private modalService: BsModalService) {}

  ngOnInit() {}
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });

    this.bsModalRef = this.modalService.show(this.modalContent, {
      // initialState,
      class: 'modal-lg',
      // backdrop: 'static',
      keyboard: true
    });
  }

  btnFilter() {
    // To make Filter Button or to follow consultation history div's width
    const btnFilter = document.querySelector('#filter-btn');
    const filterDiv = document.querySelector('#filter');

    if (btnFilter.classList.contains('col-md-1')) {
      //isHidden

      btnFilter.classList.remove('col-md-1');
      btnFilter.classList.add('col-md-3');
      btnFilter.classList.add('collapsed');

      filterDiv.classList.add('col-md-3');
      filterDiv.classList.add('collapsed');

      this.isFilterHidden = false;
    } else {
      btnFilter.classList.add('col-md-1');
      btnFilter.classList.remove('col-md-3');
      btnFilter.classList.remove('collapsed');

      filterDiv.classList.remove('col-md-3');
      filterDiv.classList.remove('collapsed');

      this.isFilterHidden = true;
    }
  }

  buttonClicked() {
    console.log('BUTTON CLICKED');
  }

  newAppointmentBtnClicked() {
    console.log('New Appointment Button Clicked');

    const initialState = {
      title: 'Schedule Appointment'
      // type: 'ATTACH_MEDICAL_COVERAGE'
    };

    this.bsModalRef = this.modalService.show(AppointmentsNewComponent, {
      initialState,
      class: 'modal-lg'
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}
