import { Request, Response } from 'express';
import FormData from 'form-data';
import axios from 'axios';

const IMGBB_API_KEY = '85c42d0a7f57e0f9c313352e47872f0a';

const uploadToImgBB = async (file: Express.Multer.File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('image', file.buffer.toString('base64'));

        console.log('Uploading to ImgBB...');
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        if (response.data.success) {
            const url = response.data.data.url;
            console.log('ImgBB upload successful! URL:', url);
            return url;
        } else {
            console.error('ImgBB upload failed:', response.data);
            throw new Error('ImgBB upload failed');
        }
    } catch (error: any) {
        console.error('ImgBB upload error:', error.response?.data || error.message);
        throw new Error('Failed to upload to ImgBB');
    }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = await uploadToImgBB(req.file);
        console.log('Sending profile image URL to frontend:', imageUrl);
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

export const uploadBanner = async (req: Request, res: Response) => {
    try {
        console.log('🎨 Banner upload request received');
        console.log('📦 File info:', req.file ? {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        } : 'NO FILE');

        if (!req.file) {
            console.error('❌ No banner file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = await uploadToImgBB(req.file);
        console.log('✅ Sending banner URL to frontend:', imageUrl);
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('❌ Error uploading banner:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

export const uploadCV = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Construct local URL for the uploaded file
        const protocol = req.protocol;
        const host = req.get('host');
        const cvUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        console.log('📄 CV uploaded locally:', cvUrl);
        res.json({ url: cvUrl });
    } catch (error) {
        console.error('Error uploading CV:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

export const uploadProjectImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = await uploadToImgBB(req.file);
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error uploading project image:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};
