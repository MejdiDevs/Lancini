import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    enterpriseId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    requirements: string[];
    type: 'internship' | 'pfe';
    location: string;
    remote: boolean;
    status: 'open' | 'closed' | 'filled' | 'pending' | 'rejected';
    chosenStudentId?: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>({
    enterpriseId: { type: Schema.Types.ObjectId, ref: 'EnterpriseProfile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    type: { type: String, enum: ['internship', 'pfe'], default: 'internship' },
    location: { type: String },
    remote: { type: Boolean, default: false },
    status: { type: String, enum: ['open', 'closed', 'filled', 'pending', 'rejected'], default: 'pending' },
    chosenStudentId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Job = mongoose.model<IJob>('Job', jobSchema);
export default Job;
