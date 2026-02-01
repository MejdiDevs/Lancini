'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    jobTitle: string;
    companyName: string;
    onSubmit: (data: ApplicationData) => Promise<void>;
}

export interface ApplicationData {
    coverLetter: string;
    availability: string;
    expectedSalary: string;
}

export function ApplicationWizard({ open, onOpenChange, jobTitle, companyName, onSubmit }: ApplicationWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ApplicationData>({
        coverLetter: '',
        availability: '',
        expectedSalary: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            setStep(4); // Summary step
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Failed to submit application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setFormData({
            coverLetter: '',
            availability: '',
            expectedSalary: '',
        });
        setIsSuccess(false);
        setIsSubmitting(false);
        onOpenChange(false);
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.coverLetter.trim().length >= 50;
            case 2:
                return formData.availability.trim().length > 0;
            case 3:
                return formData.expectedSalary.trim().length > 0;
            default:
                return true;
        }
    };

    // Success Screen
    if (isSuccess) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 border-none shadow-2xl overflow-hidden">
                    <div className="p-12 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                        <div className="w-20 h-20 rounded-full bg-[#EC6D0A] mx-auto mb-6 flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Successfully Submitted!</h2>
                        <p className="text-gray-600 font-medium">
                            Your application has been sent to {companyName}. We'll notify you of any updates.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl rounded-2xl p-0 border-none shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EC6D0A] to-[#d66209] p-8 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black mb-2">Apply for {jobTitle}</DialogTitle>
                        <p className="text-sm opacity-90 font-medium">{companyName}</p>
                    </DialogHeader>

                    {/* Progress Bar */}
                    <div className="mt-6 flex items-center gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full bg-white transition-all duration-500",
                                        step >= s ? "w-full" : "w-0"
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs mt-2 opacity-75 font-semibold">
                        {step === 4 ? 'Review' : `Step ${step} of ${totalSteps}`}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Step 1: Cover Letter */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Why are you interested in this position? *
                                </label>
                                <textarea
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    className="w-full h-40 px-4 py-3 border border-gray-200 rounded-2xl resize-none font-medium text-gray-700 focus:border-[#EC6D0A] focus:outline-none focus:ring-2 focus:ring-[#EC6D0A]/20 transition-all"
                                    placeholder="Tell us why you're a great fit for this role..."
                                />
                                <p className="text-xs text-gray-500 mt-2 font-medium">
                                    {formData.coverLetter.length}/50 characters minimum
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Availability */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    When can you start? *
                                </label>
                                <div className="space-y-3">
                                    {['Immediately', 'Within 2 weeks', 'Within 1 month', 'More than 1 month'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setFormData({ ...formData, availability: option })}
                                            className={cn(
                                                "w-full p-4 rounded-2xl border-2 font-semibold text-left transition-all",
                                                formData.availability === option
                                                    ? "border-[#EC6D0A] bg-orange-50 text-gray-900"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Expected Salary */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    What is your expected salary range? *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.expectedSalary}
                                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                                    placeholder="e.g., $2,000 - $3,000 per month"
                                    className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#EC6D0A] font-medium"
                                />
                                <p className="text-xs text-gray-500 mt-2 font-medium">
                                    This helps us match you with the right opportunities
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Summary */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-lg font-bold text-gray-900">Review Your Application</h3>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Letter</h4>
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{formData.coverLetter}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</h4>
                                    <p className="text-sm text-gray-900 font-bold">{formData.availability}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Salary</h4>
                                    <p className="text-sm text-gray-900 font-bold">{formData.expectedSalary}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 flex items-center justify-between gap-4">
                    {step > 1 && step < 5 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-full px-6 font-semibold border-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    )}

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className={cn(
                                "ml-auto rounded-full px-8 font-bold",
                                isStepValid() ? "bg-[#EC6D0A] hover:bg-[#d66209] text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <div className="ml-auto flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="rounded-full px-6 font-semibold border-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#EC6D0A] hover:bg-[#d66209] text-white rounded-full px-8 font-bold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Submit Application
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
