export interface Case{
        caseId: string,
        caseNumber: string,
        patientId: string,
        patientNRIC: string,
        patientName: string,
        clinicId: string,
        visitIds: VisitIds[],
        coverages: Coverages[],
        salesOrder: SalesOrder,
        purchasedPackage: PurchasedPackage,
        status: string,
        createdDate: string
}

export interface Coverages{
        planId: string,
        name: string
}

export interface VisitIds{
        visitId: string,
        clinicName: string,
        visitDate:string
}

export interface SalesOrder{
        taxValue: number,
        purchaseItem: purchaseItem[],
        invoices:Invoices[],
        status: string,
        totalPrice: string,
        totalPayableTax: string,
        totalPaid: string,
        outstanding: string,
        fullyDispatched: boolean,
        salesRefNo: string
}

export interface purchaseItem{
        purchasedId: string,
        itemRefId: string,
        subItems: SubItems[],
        cost: Cost,
        unitPrice: UnitPrice,
        purchaseQty: number,
        purchaseUom: string,
        priceAdjustment : PriceAdjustment,
        dosage : number,
        duration : number,
        instruct : string,
        batchNo : string,
        expireDate : string,
        remarks : string,
        excludedCoveragePlanIds : string[],
}

export interface SubItems{
        itemRefId: string,
        subItems: any,
        cost: Cost,
        unitPrice: UnitPrice,
        purchaseQty: number,
        purchaseUom: string,
        priceAdjustment : PriceAdjustment,
        dosage:number,
        duration:number,
        instruct:string,
        batchNo:string,
        expireDate:string,
        remarks: string
}

export interface PriceAdjustment{
        adjustedValue:string,
        paymentType: string
}
export interface Cost{
        price:string,
        taxIncluded: boolean
}

export interface UnitPrice{
        price:string,
        taxIncluded: boolean
}

export interface itemPriceAdjustment{
        adjustedValue: number
}
  
export interface Invoices{
        paymentMode: string,
        invoiceTime: string,
        paidTime: string,
        invoiceType: string,
        payableAmount: string,
        paidAmount: string,
        includedTaxAmount: number,
        planId: string,
        claim: Claim
}
  
export interface Claim{
        claimId: string,
        submissionDateTime: string,
        attendingDoctorId: string,
        claimDoctorId: string,
        payersNric: string,
        payersName: string,
        diagnosisCodes: string[],
        consultationAmt: string,
        medicationAmt: string,
        medicalTestAmt: string,
        otherAmt: string,
        claimExpectedAmt: string,
        gstAmount: number,
        remark: string,
        claimStatus: string,
        claimResult: ClaimResult,
        paidResult: PaidResult,
        submissionResult: SubmissionResult,
        appealRejections: AppealRejections[]
}

export interface ClaimResult{
        referenceNumber: string,
        resultDateTime: string,
        amount: string,
        statusCode: string,
        remark: string
}

export interface PaidResult{
        referenceNumber: string,
        resultDateTime: string,
        amount: string,
        statusCode: string,
        remark: string
}

export interface SubmissionResult{
        claimNo: string,
        statusCode: string,
        statusDescription: string
}

export interface AppealRejections{
        reason: string
}

export interface PurchasedPackage{
        itemRefId: string,
        code: string,
        name: string,
        packageQty: number,
        purchasePrice: string,
        purchaseDate: string,
        expireDate: string,
        status: string,
        dispatches: Dispatches[]
}

export interface Dispatches{
        itemRefId: string,
        itemCode: string,
        itemName: string,
        utilize: boolean,
        utilizedDate: string,
        payable: boolean
}