export class Drug {
    constructor(
        code: string,
        name: string,
        uom: string,
        price: DrugPrice,
        taxIncluded: boolean
    ) {}
}

export class DrugPrice {
    constructor(price: number, chargeCode: string) {}
}
