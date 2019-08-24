export class Vaccination {
    name: string;
    code: string;
    ageInMonths: string;
    id: string;

    constructor() { }
}

export class VaccinationSchedule {
    vaccineId: string;
    scheduledDate: Date;

    constructor() { }
}
