"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, ArrowRight, File, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    
    const isDoc = selectedFile.name.endsWith(".docx") || selectedFile.name.endsWith(".doc") || selectedFile.name.endsWith(".pdf");

    if (!validTypes.includes(selectedFile.type) && !isDoc) {
      setErrorMsg("Please upload a valid .pdf, .docx, or .doc file.");
      return;
    }
    setFile(selectedFile);
    setErrorMsg("");
  };

  const handleClick = () => {
    if (status === "idle" || status === "error") fileInputRef.current?.click();
  };

  const processUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      
      const docId = uploadData.documentId;
      
      setStatus("analyzing");
      
      setTimeout(() => {
        setStatus("done");
        setTimeout(() => {
          router.push(`/contract/${docId}`);
        }, 1000);
      }, 1500);
      
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
        accept=".pdf,.docx,.doc" 
        className="hidden" 
      />
      
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative cursor-pointer bg-gradient-to-br from-card to-card/50 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          isDragging 
            ? "border-emerald-500 bg-emerald-500/5 scale-[1.02]" 
            : status === "idle" || status === "error"
              ? "border-border/50 hover:border-primary/30 hover:bg-card/80"
              : "border-transparent cursor-default"
        }`}
      >
        <div className="p-10 md:p-14 text-center min-h-[350px] flex flex-col items-center justify-center">
           <AnimatePresence mode="wait">
             {status === "idle" && !file && (
               <motion.div 
                 key="idle" 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3 }}
                 className="flex flex-col items-center"
               >
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10"
                  >
                    <UploadCloud className="w-9 h-9 text-emerald-400" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Drop your contract here</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    or click to browse files
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 bg-muted rounded-lg text-muted-foreground font-medium">.PDF</span>
                    <span className="text-xs px-3 py-1.5 bg-muted rounded-lg text-muted-foreground font-medium">.DOCX</span>
                    <span className="text-xs px-3 py-1.5 bg-muted rounded-lg text-muted-foreground font-medium">.DOC</span>
                  </div>
               </motion.div>
            )}
            
            {file && (status === "idle" || status === "error") && (
               <motion.div 
                 key="file" 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3 }}
                 className="flex flex-col items-center w-full"
               >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <File className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1 truncate max-w-[300px]">{file.name}</h3>
                  <p className="text-sm text-muted-foreground mb-8">{formatFileSize(file.size)}</p>
                  
                  {status === "error" && (
                    <div className="mb-6 px-4 py-3 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 flex items-center gap-2">
                       <AlertCircle className="w-4 h-4" />
                       {errorMsg}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setErrorMsg(""); }}
                      className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); processUpload(); }}
                      className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
                    >
                      <span>Start Analysis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
               </motion.div>
            )}

            {status === "uploading" && (
               <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 relative">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Uploading document...</h3>
                  <p className="text-muted-foreground text-sm">Preparing for analysis</p>
               </motion.div>
            )}

            {status === "analyzing" && (
               <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground text-sm">Scanning clauses and identifying risks...</p>
               </motion.div>
            )}

            {status === "done" && (
               <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analysis Complete</h3>
                  <p className="text-muted-foreground text-sm">Redirecting to results...</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}