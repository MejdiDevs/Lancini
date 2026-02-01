'use client';

import { useState, useEffect, useRef } from 'react';
import { CVData, initialCVState } from '@/types/cv';
import { CVEditor } from '@/components/cv/CVEditor';
import { CVPreview } from '@/components/cv/CVPreview';
import { Button } from '@/components/ui/Button';
import { Download, Save, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVPdf } from '@/components/cv/CVPdf';

export default function CVDesignerPage() {
    const [data, setData] = useState<CVData>(initialCVState);
    const [previewData, setPreviewData] = useState<CVData>(initialCVState);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
    const [isClient, setIsClient] = useState(false);

    // Refs for safe access in timeouts/cleanup
    const dataRef = useRef(data);
    const saveStatusRef = useRef(saveStatus);
    const isInitialized = useRef(false);

    // Sync refs
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        saveStatusRef.current = saveStatus;
    }, [saveStatus]);

    // Debounce preview updates
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewData(data);
        }, 1000);
        return () => clearTimeout(timer);
    }, [data]);

    // Mark as unsaved on change
    useEffect(() => {
        if (isInitialized.current) {
            setSaveStatus('unsaved');
        }
    }, [data]);

    // Auto-save timer
    useEffect(() => {
        if (saveStatus === 'unsaved') {
            const timer = setTimeout(() => {
                performSave(true);
            }, 2000); // Auto-save after 2 seconds of inactivity
            return () => clearTimeout(timer);
        }
    }, [saveStatus, data]); // Reset timer on data change due to saveStatus staying 'unsaved'

    // Save on unmount / page leave
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveStatusRef.current === 'unsaved') {
                // Trigger browser confirmation dialog for tab close safety
                e.preventDefault();
                e.returnValue = '';
                // Attempt to save (might be cancelled)
                performSave(true, dataRef.current);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Save on component unmount (route change)
            if (saveStatusRef.current === 'unsaved') {
                performSave(true, dataRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setIsClient(true);
        fetchCV();
    }, []);

    const fetchCV = async () => {
        try {
            const { data: responseData } = await api.get('/cv');
            if (responseData.sections && responseData.sections.length > 0) {
                const newData = { ...initialCVState };
                responseData.sections.forEach((section: any) => {
                    if (section.type === 'personal') newData.personal = section.content;
                    if (section.type === 'education') newData.education = section.content;
                    if (section.type === 'experience') newData.experience = section.content;
                    if (section.type === 'skills') newData.skills = section.content;
                    if (section.type === 'projects') newData.projects = section.content;
                });
                setData(newData);
                setPreviewData(newData);
            }
        } catch (error) {
            console.error('Failed to fetch CV:', error);
        } finally {
            setLoading(false);
            // Allow tracking changes after initial fetch
            setTimeout(() => { isInitialized.current = true; }, 500);
        }
    };

    const performSave = async (silent = false, specificData?: CVData) => {
        if (saveStatusRef.current === 'saving' && !specificData) return; // Prevent double save unless forced (unmount)

        setSaveStatus('saving');
        const dataToSave = specificData || data;

        try {
            const sections = [
                { id: 'personal', type: 'personal', title: 'Personal Details', visible: true, content: dataToSave.personal },
                { id: 'education', type: 'education', title: 'Education', visible: true, content: dataToSave.education },
                { id: 'experience', type: 'experience', title: 'Experience', visible: true, content: dataToSave.experience },
                { id: 'skills', type: 'skills', title: 'Skills', visible: true, content: dataToSave.skills },
                { id: 'projects', type: 'projects', title: 'Projects', visible: true, content: dataToSave.projects },
            ];

            await api.put('/cv', { sections, templateId: 'modern' });

            setSaveStatus('saved');
            if (!silent) alert('CV Saved Successfully!');
        } catch (error) {
            console.error('Save failed', error);
            setSaveStatus('error');
            if (!silent) alert('Failed to save CV');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading CV...</div>;

    const getStatusIndicator = () => {
        switch (saveStatus) {
            case 'saved': return <span className="text-xs text-orange-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Saved</span>;
            case 'saving': return <span className="text-xs text-brand-blue font-medium flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>;
            case 'unsaved': return <span className="text-xs text-[#EC6D0A] font-medium">Unsaved changes</span>;
            case 'error': return <span className="text-xs text-red-600 font-medium">Save failed</span>;
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Toolbar */}
            <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
                <div>
                    <h1 className="text-xl font-bold">Standard CV Designer</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground">Edit your details and preview in real-time</p>
                        <span className="text-gray-300">|</span>
                        {getStatusIndicator()}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => performSave(false)} disabled={saveStatus === 'saving'}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                    </Button>

                    {isClient && (
                        <PDFDownloadLink document={<CVPdf data={previewData} />} fileName="my-cv.pdf">
                            {({ blob, url, loading, error }) => (
                                <Button disabled={loading}>
                                    <Download className="h-4 w-4 mr-2" />
                                    {loading ? 'Generating...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </div>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel (Scrollable) */}
                <div className="w-1/2 overflow-y-auto border-r bg-background p-6">
                    <div className="max-w-2xl mx-auto">
                        <CVEditor data={data} onChange={setData} />
                    </div>
                </div>

                {/* Preview Panel (Fixed/Scrollable independantly) */}
                <div className="w-1/2 bg-muted/30 flex items-center justify-center p-8 overflow-hidden">
                    <div className="h-full aspect-[1/1.414] shadow-2xl bg-white">
                        <CVPreview data={previewData} />
                    </div>
                </div>
            </div>
        </div>
    );
}


