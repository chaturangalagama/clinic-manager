import { MaxDiscount } from './MaxDiscount';
interface Vaccine {
    id: string;
    code: string;
    name: string;
    ageInMonths: number;
    doses?: Dose[];
}

interface Dose {
    doseId: string;
    name: string;
    description: string;
    price: Price;
    priceAdjustment: MaxDiscount;
    nextDoseRecommendedGap: number;
}

interface Price {
    price: number;
    taxIncluded: boolean;
}

export { Vaccine, Dose, Price };
