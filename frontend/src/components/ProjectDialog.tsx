import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Heart, Eye, ExternalLink, Globe } from "lucide-react";

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    link?: string;
    likes: number;
    views: number;
}

interface ProjectDialogProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onLike: (id: string) => void;
    isLiked: boolean;
    loadingLike?: boolean;
}

export function ProjectDialog({ project, isOpen, onClose, onLike, isLiked, loadingLike }: ProjectDialogProps) {
    if (!project) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl bg-white border-neutral-100 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="visually-hidden">
                    <DialogTitle>{project.title}</DialogTitle>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Image Section */}
                    <div className="w-full aspect-video md:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100 relative group mx-auto">
                        {project.imageUrl ? (
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <Globe className="h-20 w-20" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{project.title}</h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#EC6D0A]/10 text-[#EC6D0A] text-[10px] font-black rounded-full uppercase tracking-wider">{tag}</span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 font-medium leading-relaxed mb-8 whitespace-pre-line text-base md:text-lg">
                        {project.description}
                    </p>

                    {/* Footer Stats & Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => onLike(project._id)}
                                disabled={loadingLike}
                                className={`flex items-center gap-2 transition-all hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                            >
                                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                                <span className={`font-black text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>{project.likes}</span>
                            </button>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Eye className="h-6 w-6" />
                                <span className="font-black text-lg text-gray-400">{project.views}</span>
                            </div>
                        </div>

                        {project.link && (
                            <Button asChild className="rounded-xl px-6 h-12 font-bold bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200">
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    Visit <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
