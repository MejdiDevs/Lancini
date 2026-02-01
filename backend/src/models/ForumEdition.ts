import mongoose, { Document, Schema } from 'mongoose';

export interface IForumEdition extends Document {
    year: number;
    title: string;
    description: string;
    highlights: string[];
    charteGraphique: Array<{
        name: string;
        url: string;
        fileSize: number;
    }>;
    gallery: Array<{
        url: string;
        caption: string;
    }>;
    statistics: {
        studentsParticipated: number;
        companiesParticipated: number;
        internshipsOffered: number;
    };
    published: boolean;
}

const forumEditionSchema = new Schema<IForumEdition>({
    year: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    charteGraphique: [{
        name: String,
        url: String,
        fileSize: Number
    }],
    gallery: [{
        url: String,
        caption: String
    }],
    statistics: {
        studentsParticipated: { type: Number, default: 0 },
        companiesParticipated: { type: Number, default: 0 },
        internshipsOffered: { type: Number, default: 0 }
    },
    published: { type: Boolean, default: true }
}, { timestamps: true });

const ForumEdition = mongoose.model<IForumEdition>('ForumEdition', forumEditionSchema);
export default ForumEdition;
