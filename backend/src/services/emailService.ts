import emailjs from '@emailjs/nodejs';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_6odmnk7';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_f5ot4zo';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'TpJ--LUsMqwicuWUn';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '5iVrmyIi_S4VRtC_-pXXg';

// Debug logging
console.log('🔍 EmailJS Configuration:');
console.log('  Service ID:', EMAILJS_SERVICE_ID);
console.log('  Template ID:', EMAILJS_TEMPLATE_ID);
console.log('  Public Key:', EMAILJS_PUBLIC_KEY ? `${EMAILJS_PUBLIC_KEY.substring(0, 5)}...` : 'MISSING');
console.log('  Private Key:', EMAILJS_PRIVATE_KEY ? `${EMAILJS_PRIVATE_KEY.substring(0, 5)}...` : 'MISSING');
console.log('');

export const sendVerificationEmail = async (
    to: string,
    userName: string,
    verificationToken: string
) => {
    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;

    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: to,
                to_name: userName,
                verification_url: verificationUrl,
                from_name: "ENET'Com Forum",
            },
            {
                publicKey: EMAILJS_PUBLIC_KEY,
                privateKey: EMAILJS_PRIVATE_KEY,
            }
        );

        console.log('✅ Verification email sent successfully:', response);
        return { success: true, messageId: response.text };
    } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendPasswordResetEmail = async (
    to: string,
    userName: string,
    resetToken: string
) => {
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: to,
                to_name: userName,
                reset_url: resetUrl,
                from_name: "ENET'Com Forum",
            },
            {
                publicKey: EMAILJS_PUBLIC_KEY,
                privateKey: EMAILJS_PRIVATE_KEY,
            }
        );

        console.log('✅ Password reset email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};
