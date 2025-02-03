
export interface IMedication {
    _id: string;
    name: string;
    frequency: string;
    reportedBy: string;
}

export interface IAllergy {
    _id: string;
    allergicTo: string;
    Severity: string;
    reaction: string;
}

export interface ISurgery {
    _id: string;
    procedure: string,
    date: Date;
}

export interface IFamilyHistory {
    _id: string;
    condition: string;
    relationship: string;
}

// export interface IBodyMeasureMents {
//     height: {
//         feet: number;
//         inches: number;
//     }
//     weight: number;
//     bmi: string
// }

export interface IHealthHistory {
    _id: string;
    patientId: string;
    patientType: 'Patient' | 'Dependent';
    medications: IMedication[];
    allergies: IAllergy[];
    healthConditions: string[];
    surgeries: ISurgery[];
    familyHistory: IFamilyHistory[];
    // bodyMeasurements: IBodyMeasureMents

}