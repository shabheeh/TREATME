import { Schema, Types, model } from "mongoose";
import { IBehaviouralHealth } from "src/interfaces/IBehaviouralHealth";

const behaviourHealthSchema = new Schema<IBehaviouralHealth>({
    patientId: { 
        type: Types.ObjectId, 
        required: true,
        refPath: 'patientType', 
        },
    patientType: {
        type: String,
        enum: ['Patient', 'Dependent'],
        required: true,
    },
    conditions: { type: [String], required: true },
    anxietyLevel: { type: Number, required: true },
    depressionLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    therapyStatus: { type: String, required: true },
    supportSystem: { type: [String], required: true },
    copingMechanisms: { type: [String], required: true },
    lastEpisodeDate: { type: Date, optional: true },
},
{
    timestamps: true,
}
);

export const BehaviouralHealthModel = model<IBehaviouralHealth>('BehaviouralHealth', behaviourHealthSchema);


