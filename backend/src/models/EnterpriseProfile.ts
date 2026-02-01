import mongoose, { Document, Schema } from 'mongoose';

export interface IEnterpriseProfile extends Document {
    userId: mongoose.Types.ObjectId;
    slug: string;
    companyName: string;
    logoUrl?: string;
    bannerUrl?: string;
    description?: string;
    industry?: string;
    website?: string;
    location?: string;
    size?: string;
    contactName?: string;
    linkedin?: string;
    twitter?: string;
    onboardingComplete: boolean;
    isApproved: boolean;
}

const enterpriseProfileSchema = new Schema<IEnterpriseProfile>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    description: { type: String },
    industry: { type: String },
    website: { type: String },
    location: { type: String },
    size: { type: String },
    contactName: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    onboardingComplete: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const EnterpriseProfile = mongoose.model<IEnterpriseProfile>('EnterpriseProfile', enterpriseProfileSchema);
export default EnterpriseProfile;
