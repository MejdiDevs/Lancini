import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    status: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';
    appliedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'interviewing', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a student can only apply once to a specific job
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application = mongoose.model<IApplication>('Application', applicationSchema);
export default Application;
