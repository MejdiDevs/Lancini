import mongoose, { Document, Schema } from 'mongoose';

export interface ICVSection {
    id: string;
    type: string;
    title: string;
    visible: boolean;
    content: any;
}

export interface ICV extends Document {
    userId: mongoose.Types.ObjectId;
    templateId: string;
    sections: ICVSection[];
    pdfUrl?: string;
    score?: number;
}

const cvSchema = new Schema<ICV>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: String, default: 'modern' },
    sections: [{
        _id: false,
        id: String,
        type: { type: String },
        title: String,
        visible: Boolean,
        content: Schema.Types.Mixed
    }],
    pdfUrl: { type: String },
    score: { type: Number }
}, { timestamps: true });

const CV = mongoose.model<ICV>('CV', cvSchema);
export default CV;
