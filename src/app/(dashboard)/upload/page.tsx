import { FileDropzone } from "@/components/upload/dropzone";
import { Upload, Brain, Shield } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">New Analysis</h1>
          <p className="text-slate-400 mt-2">Upload a contract for AI-powered risk analysis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Upload Contract</h3>
            <p className="text-sm text-slate-500">Drag & drop PDF or DOCX files</p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">AI Analysis</h3>
            <p className="text-sm text-slate-500">Deep clause scanning & benchmarking</p>
          </div>
          <div className="glass rounded-xl p-5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Risk Report</h3>
            <p className="text-sm text-slate-500">Comprehensive risk assessment</p>
          </div>
        </div>
        
        <FileDropzone />
      </div>
    </div>
  );
}