import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './payment-multi-step-layout.component.html'
})
export class PaymentMultiStepLayoutComponent {
    constructor() { }

    ngOnInit() { }

    onActivate(event) {
        window.scroll(0, 0);
        // console.log(event);
    }
}
