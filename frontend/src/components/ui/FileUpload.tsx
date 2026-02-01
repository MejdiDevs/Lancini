import { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import api from '@/services/api';

interface FileUploadProps {
    endpoint: string; // e.g., '/upload/profile-image'
    accept?: string;
    maxSizeMB?: number;
    onUploadComplete: (url: string) => void;
    currentUrl?: string;
    label: string;
    preview?: boolean;
}

export function FileUpload({
    endpoint,
    accept = 'image/*',
    maxSizeMB = 5,
    onUploadComplete,
    currentUrl,
    label,
    preview = true
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local state when prop changes
    useEffect(() => {
        setPreviewUrl(currentUrl || null);
    }, [currentUrl]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        // Show preview for images
        if (file.type.startsWith('image/') && preview) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

        // Upload file
        try {
            const formData = new FormData();
            const fieldName = endpoint.includes('cv') ? 'file' : 'image';
            formData.append(fieldName, file);

            console.log('Uploading to endpoint:', endpoint);
            const { data } = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload successful! Received URL:', data.url);
            onUploadComplete(data.url);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.message || 'Upload failed');
            setPreviewUrl(currentUrl || null);
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onUploadComplete('');
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            <div className="relative">
                {/* Show Preview for Images */}
                {previewUrl && preview ? (
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : previewUrl && !preview ? (
                    // Show File Info for Non-Preview Files (like CVs)
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">File Uploaded</span>
                                <span className="text-xs text-muted-foreground truncate">{previewUrl.split('/').pop()}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    // Upload Button
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-dashed"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Click to upload or drag and drop
                                </span>
                            </div>
                        )}
                    </Button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
