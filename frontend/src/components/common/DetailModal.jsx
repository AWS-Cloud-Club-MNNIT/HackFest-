import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function DetailModal({ isOpen, onClose, title, children }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Container */}
      <div 
        className="relative bg-[#101522] border border-[#d4af37]/40 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.15)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#d4af37]/20 flex-shrink-0 bg-[#101522] rounded-t-2xl z-10">
          <h3 className="text-2xl font-bold font-display text-[#d4af37] truncate pr-4">
            {title || "Details"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <XCircle className="w-7 h-7" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar min-h-0">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
