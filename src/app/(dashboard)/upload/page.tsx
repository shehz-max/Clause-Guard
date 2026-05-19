import { FileDropzone } from "@/components/upload/dropzone";
import { Upload, Brain, Shield } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight">New Analysis</h1>
          <p className="text-[#64748B] mt-2">Upload a contract for AI-powered risk analysis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
            <div className="w-10 h-10 bg-[#CCFBF1] rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-[#0F766E]" />
            </div>
            <h3 className="font-semibold text-[#1E293B] mb-1">Upload Contract</h3>
            <p className="text-sm text-[#64748B]">Drag & drop PDF or DOCX files</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
            <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-[#1E3A5F]" />
            </div>
            <h3 className="font-semibold text-[#1E293B] mb-1">AI Analysis</h3>
            <p className="text-sm text-[#64748B]">Deep clause scanning & benchmarking</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
            <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-[#1E3A5F]" />
            </div>
            <h3 className="font-semibold text-[#1E293B] mb-1">Risk Report</h3>
            <p className="text-sm text-[#64748B]">Comprehensive risk assessment</p>
          </div>
        </div>
        
        <FileDropzone />
      </div>
    </div>
  );
}