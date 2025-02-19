
export interface IMedication {
    _id: string;
    name: string;
    frequency: string;
    reportedBy: string;
}

export interface IAllergy {
    _id: string;
    allergicTo: string;
    severity: string;
    reaction: string;
    reportedBy: string;
}

export interface ISurgery {
    _id: string;
    procedure: string,
    year: string;
    reportedBy: string;
}

export interface IFamilyHistory {
    _id?: string;
    condition: string;
    relationship: string;
}

export interface IHealthCondition {
    _id: string;
    condition: string;
    reportedBy: string;
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
    healthConditions: IHealthCondition[];
    surgeries: ISurgery[];
    familyHistory: IFamilyHistory[];
    // bodyMeasurements: IBodyMeasureMents

}

export interface ILifestyle {
    _id: string;
    patientId: string;
    patientType: 'Patient' | 'Dependent';
    sleepSevenPlusHrs: boolean;
    doExercise: boolean;
    doDrugs: boolean;
    doSmoke: boolean;
    doAlcohol: boolean;
    followDietPlan: boolean;
    highStress: boolean;
    vaccinatedCovid19: boolean
    doMeditate: boolean;
}


export interface IBehaviouralHealth {
    _id?: string;
    conditions: string[];
    anxietyLevel: number;
    depressionLevel: number;
    stressLevel: number;
    therapyStatus: string;
    supportSystem: string[];
    copingMechanisms: string[];
    lastEpisodeDate?: Date
  }