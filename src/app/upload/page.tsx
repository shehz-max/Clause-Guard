import { FileDropzone } from "@/components/upload/dropzone";
import { Zap } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16 relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
          <Zap className="w-3 h-3 fill-primary" />
          Intelligence Engine
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6 text-foreground">Prepare New Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Upload any legal agreement to initialize the ClauseGuard pipeline. Our agentic AI will automatically identify risks, benchmark against standards, and calculate a comprehensive liability score.
        </p>
      </div>
      
      <FileDropzone />
    </div>
  );
}
