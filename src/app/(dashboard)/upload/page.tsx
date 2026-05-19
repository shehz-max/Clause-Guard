import { FileDropzone } from "@/components/upload/dropzone";
import { Zap, Upload, Shield, Brain } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">New Analysis</h1>
              <p className="text-muted-foreground text-sm">Upload a contract for AI-powered risk analysis</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Upload Contract</h3>
            <p className="text-sm text-muted-foreground">Drag & drop PDF or DOCX files</p>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">Deep clause scanning & benchmarking</p>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Risk Report</h3>
            <p className="text-sm text-muted-foreground">Comprehensive risk assessment</p>
          </div>
        </div>
        
        <FileDropzone />
      </div>
    </div>
  );
}