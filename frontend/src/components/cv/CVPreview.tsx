'use client';
import { initialCVState, CVData } from '@/types/cv';
import dynamic from 'next/dynamic';

// Dynamic import for PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                Loading PDF Preview...
            </div>
        ),
    }
);

import { CVPdf } from './CVPdf';

interface CVPreviewProps {
    data: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
    return (
        <div className="h-full w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
            <PDFViewer width="100%" height="100%" className="border-none">
                <CVPdf key={JSON.stringify(data)} data={data} />
            </PDFViewer>
        </div>
    );
};
