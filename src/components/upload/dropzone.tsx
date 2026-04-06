"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
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
    
    // Quick fallback check by extension if mime type is missing or generic
    const isDoc = selectedFile.name.endsWith(".docx") || selectedFile.name.endsWith(".doc") || selectedFile.name.endsWith(".pdf");

    if (!validTypes.includes(selectedFile.type) && !isDoc) {
      setErrorMsg("Please upload a valid .pdf or .docx file.");
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
      
      // Backend automatically kicks off analysis. Show fake progress so UI transitions nicely.
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
        accept=".pdf,.docx,.doc" 
        className="hidden" 
      />
      
      <motion.div
        whileHover={status === "idle" || status === "error" ? { y: -4 } : {}}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden group bg-card border border-border/30 rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-black/40 ${
          isDragging 
            ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
            : "hover:bg-card/80 hover:border-primary/30"
        } ${status !== "idle" && status !== "error" ? "pointer-events-none opacity-90" : ""}`}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />

         <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-14 text-center min-h-[400px] relative z-10">
           <AnimatePresence mode="wait">
             {status === "idle" && !file && (
                <motion.div 
                  key="idle" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex flex-col items-center"
                >
                   <div 
                     onClick={handleClick}
                     className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20 shadow-lg shadow-primary/5 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                   >
                     <UploadCloud className="w-10 h-10 text-primary" strokeWidth={2} />
                   </div>
                   <h3 className="text-3xl font-heading font-bold mb-3 text-foreground tracking-tight">Extract Contract Risks</h3>
                   <p className="text-muted-foreground/80 mb-8 max-w-sm leading-relaxed">
                     Drag and drop your legal contract here, or <span onClick={handleClick} className="text-primary font-semibold hover:underline cursor-pointer">browse files</span> to begin AI analysis.
                   </p>
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-muted-foreground font-bold tracking-widest uppercase">.PDF, .DOCX Supported</span>
                     <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-muted-foreground font-bold tracking-widest uppercase">Safe & Private</span>
                   </div>
                </motion.div>
             )}
             
             {file && (status === "idle" || status === "error") && (
                <motion.div 
                  key="file" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex flex-col items-center"
                >
                   <div className="w-20 h-20 bg-zinc-800 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-xl">
                     <FileType className="w-9 h-9 text-primary" strokeWidth={2} />
                   </div>
                   <h3 className="text-2xl font-heading font-bold mb-2 text-foreground truncate max-w-[350px] tracking-tight">{file.name}</h3>
                   <p className="text-muted-foreground mb-8">{(file.size / 1024).toFixed(1)} KB • Ready for deep analysis</p>
                   
                   {status === "error" && (
                     <div className="mb-8 px-5 py-3 bg-destructive/10 text-destructive text-sm font-medium rounded-2xl border border-destructive/20 flex items-center shadow-lg">
                        <AlertCircle className="w-4 h-4 mr-3" />
                        {errorMsg}
                     </div>
                   )}
                   
                   <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                     <button 
                       onClick={(e) => { e.stopPropagation(); setFile(null); }}
                       className="px-6 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto text-center"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); processUpload(); }}
                       className="bg-primary text-primary-foreground font-bold px-8 sm:px-10 py-4 rounded-2xl transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group w-full sm:w-auto"
                     >
                       <span>Initiate AI Analysis</span>
                       <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                     </button>
                   </div>
                </motion.div>
             )}

             {status === "uploading" && (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                   <div className="relative w-20 h-20 mb-8">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                   </div>
                   <h3 className="text-2xl font-heading font-bold mb-2 text-foreground tracking-tight">Uploading & Chunking</h3>
                   <p className="text-muted-foreground">Preparing document for vector analysis...</p>
                </motion.div>
             )}

             {status === "analyzing" && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                   <div className="relative w-20 h-20 mb-10 overflow-hidden rounded-full ring-4 ring-primary/20 bg-primary/5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_100%)] animate-[spin_3s_linear_infinite] opacity-50" />
                      <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={3} />
                   </div>
                   <h3 className="text-2xl font-heading font-bold mb-3 text-foreground tracking-tight">AI Analysis in Progress</h3>
                   <p className="text-muted-foreground max-w-sm">Our agentic pipeline is identifying risks and clauses. This typically takes 15-20s...</p>
                </motion.div>
             )}

             {status === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
                     <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
                   </div>
                   <h3 className="text-2xl font-heading font-bold mb-2 text-foreground tracking-tight">Analysis Complete</h3>
                   <p className="text-muted-foreground font-medium">Your insights are ready. Redirecting now...</p>
                </motion.div>
             )}
           </AnimatePresence>
         </div>
      </motion.div>
    </div>
  );
}
