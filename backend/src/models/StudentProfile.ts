import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
    userId: mongoose.Types.ObjectId;
    username: string;
    firstName: string;
    lastName: string;
    profileImage?: string; // Renamed from avatarUrl
    bannerImage?: string; // Renamed from bannerUrl
    bio?: string; // Renamed from about
    skills: string[];
    studyYear: string;
    specialization?: string;
    linkedin?: string; // Renamed from linkedinUrl
    github?: string; // Renamed from githubUrl
    portfolio?: string; // Renamed from portfolioUrl
    lookingForInternship: boolean;
    cvUrl?: string; // Renamed from cvId and changed type to string
    createdAt: Date; // Added createdAt
}

const studentProfileSchema = new Schema<IStudentProfile>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: { type: String }, // Renamed from avatarUrl
    bannerImage: { type: String }, // Renamed from bannerUrl
    bio: { type: String, maxlength: 500 }, // Renamed from about
    skills: [{ type: String }],
    studyYear: { type: String, default: '1A' },
    specialization: { type: String },
    linkedin: { type: String }, // Renamed from linkedinUrl
    github: { type: String }, // Renamed from githubUrl
    portfolio: { type: String }, // Renamed from portfolioUrl
    lookingForInternship: { type: Boolean, default: true },
    cvUrl: { type: String }, // Renamed from cvId and changed type to string
    createdAt: { type: Date, default: Date.now } // Added createdAt
}, { timestamps: true });

const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', studentProfileSchema);
export default StudentProfile;
