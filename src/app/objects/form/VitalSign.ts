class VitalSigns {
    weight = '';
    height = '';
    bmi = '';
    bp: BloodPressure;
    pulse = '';
    resp = '';
    temperature = '';
    sa02 = '';
    others? = '';
}

interface BloodPressure {
    systolic: string;
    diastolic: string;
}

export { VitalSigns };
