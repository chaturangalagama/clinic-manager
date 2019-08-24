export class Payment {
    mainCharge: number;
    otherCharge: number;
    gstValue: number;
    totalCharge: number;
    isPaid: boolean;
    paymentMethod: string;

    constructor(
        mainCharge: number,
        otherCharge: number,
        gstValue: number
    ) {
        this.mainCharge = mainCharge;
        this.otherCharge = otherCharge;
        this.gstValue = gstValue;
        this.totalCharge = (mainCharge + otherCharge) * (1 + gstValue);
        this.isPaid = false;
        this.paymentMethod = '';
    }
}
