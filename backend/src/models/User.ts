import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: 'STUDENT' | 'ENTERPRISE' | 'ADMIN';
    status: 'pending_verification' | 'pending_approval' | 'active' | 'banned';
    emailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    savedJobs?: mongoose.Types.ObjectId[];
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'ENTERPRISE', 'ADMIN'], default: 'STUDENT' },
    status: { type: String, default: 'pending_verification' },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
