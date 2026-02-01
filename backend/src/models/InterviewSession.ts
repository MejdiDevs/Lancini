import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewSession extends Document {
    userId: mongoose.Types.ObjectId;
    jobId?: mongoose.Types.ObjectId;
    role: string;
    messages: Array<{
        role: 'interviewer' | 'candidate';
        content: string;
        timestamp: Date;
    }>;
    scores?: any;
    isFinished: boolean;
}

const interviewSessionSchema = new Schema<IInterviewSession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    role: { type: String, required: true },
    messages: [{
        _id: false,
        role: { type: String, enum: ['interviewer', 'candidate'] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    scores: { type: Schema.Types.Mixed },
    isFinished: { type: Boolean, default: false }
}, { timestamps: true });

const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', interviewSessionSchema);
export default InterviewSession;
