"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, ShieldAlert, Clock, ArrowRight, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface Contract {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'analyzed' | 'failed';
  created_at: string;
  analyses?: { overall_risk_score: number; risk_level: string }[];
}

interface ContractCardProps {
  contract: Contract;
  onDelete?: (id: string) => void;
}

export function ContractCard({ contract, onDelete }: ContractCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isAnalyzed = contract.status === 'analyzed';
  const analysis = isAnalyzed && contract.analyses && contract.analyses.length > 0 ? contract.analyses[0] : null;
  
  const score = analysis?.overall_risk_score ?? 0;
  const isHighRisk = score < 50;
  const isMedRisk = score >= 50 && score < 80;
  
  const dateStr = new Date(contract.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/contracts/${contract.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete contract');
      }
      
      onDelete?.(contract.id);
    } catch (error: any) {
      alert(error.message || 'Failed to delete contract');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
      setShowMenu(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.3)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative glass rounded-2xl border border-white/5 hover:border-indigo-500/30 overflow-hidden"
    >
      <Link href={contract.status === 'analyzed' ? `/contract/${contract.id}` : '#'} className="block p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all">
            <FileText className="w-5 h-5" />
          </div>
          
          <div className="flex items-center gap-2">
            {isAnalyzed && analysis ? (
              <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 ${
                isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                isMedRisk ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-red-500 animate-pulse' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {score.toFixed(0)}
              </div>
            ) : contract.status === 'failed' ? (
              <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Failed
              </div>
            ) : (
              <div className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-slate-400 border border-white/5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
                {contract.status}
              </div>
            )}
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-white text-base mb-3 line-clamp-2 leading-tight" title={contract.filename}>
          {contract.filename}
        </h3>
        
        <p className="text-sm text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          {dateStr}
        </p>

        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-400">View Report</span>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(false);
            }}
          />
          <div className="absolute right-4 top-16 z-20 glass-strong rounded-xl py-1 min-w-[140px] border border-white/10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(true);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(false);
            }}
          >
            <div 
              className="glass-strong rounded-2xl p-6 max-w-sm w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Contract?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                This will permanently delete "{contract.filename}" and all associated analysis data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirm(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}