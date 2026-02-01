import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    link?: string;
    likes: number;
    views: number;
    createdAt: Date;
}

const ProjectSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String }],
    link: { type: String },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', ProjectSchema);
