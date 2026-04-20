import React, { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  Copy, 
  CreditCard, 
  Info, 
  X, 
  ChevronRight, 
  QrCode,
  Heart,
  Smartphone,
  ShieldCheck
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generatePixPayload } from "./lib/pix";

// Utility for concatenating tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PIX_KEY = "dd5bbbba-51d3-4f30-b4ba-3fdc4aec9132";
const PRESET_VALUES = [5, 10, 15, 20, 25, 30, 50, 100];

export default function App() {
  const [amount, setAmount] = useState<string>("10");
  const [payerName, setPayerName] = useState("");
  const [payerCpf, setPayerCpf] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Generate PIX Data
  const pixData = useMemo(() => {
    const numAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numAmount) || numAmount <= 0) return null;

    const payload = generatePixPayload({
      key: PIX_KEY,
      amount: numAmount,
      txid: "AGUIANORTE" + Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    });

    return {
      payload,
      amount: numAmount,
      txid: "AGUIANORTE..."
    };
  }, [amount, isModalOpen]); // Only regenerate when modal opens or amount changes significantly

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.payload);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 font-sans selection:bg-neon-blue/30 text-slate-100">
      {/* Background Ornamentation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-neon-blue/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-neon-green/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
            <Heart className="w-3 h-3 fill-current" />
            Contribuição Voluntária
          </div>
          <p className="text-neon-green font-black uppercase tracking-[0.3em] text-sm mb-2 drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">
            Desbravadores
          </p>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Águia do <span className="text-gold-500 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">Norte</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Sua contribuição ajuda nosso clube a voar mais alto. Escolha um valor para gerar o seu PIX.
          </p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl bg-brand-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/50 border border-white/5 overflow-hidden"
        >
          {/* Key Info Strip */}
          <div className="bg-brand-900 border-b border-white/5 p-4 flex items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                <Smartphone className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Chave PIX Oficial</p>
                <p className="font-mono text-sm tracking-tight text-gold-500">{PIX_KEY.substring(0, 18)}...</p>
              </div>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(PIX_KEY);
                alert("Chave copiada!");
              }}
              className="text-slate-400 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 lg:p-12">
            <form onSubmit={handleGenerate} className="space-y-8">
              {/* Personal Info Stack */}
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Nome do Pagador</label>
                  <input 
                    type="text" 
                    placeholder="Opcional"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full bg-brand-950/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-neon-blue transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">CPF do Pagador</label>
                  <input 
                    type="text" 
                    placeholder="Opcional"
                    value={payerCpf}
                    onChange={(e) => setPayerCpf(e.target.value)}
                    className="w-full bg-brand-950/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-neon-blue transition-all outline-none"
                  />
                </div>
              </div>

              {/* Value Selector */}
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Valor Sugerido</label>
                  <div className="flex items-center gap-1 text-slate-600 text-[10px] font-medium">
                    <Info className="w-3 h-3" />
                    BRL (Brasil)
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_VALUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className={cn(
                        "py-3 rounded-xl border text-sm font-bold transition-all duration-300",
                        amount === val.toString() 
                          ? "bg-neon-blue border-neon-blue text-brand-950 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                          : "bg-transparent border-white/10 text-slate-400 hover:border-neon-blue/40 hover:text-neon-blue"
                      )}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 font-bold text-xl">R$</div>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Outro valor"
                    className="w-full bg-brand-950/50 border border-white/5 rounded-2xl pl-12 pr-4 py-5 text-white font-bold text-2xl placeholder:text-slate-700 focus:ring-2 focus:ring-neon-green focus:border-neon-green transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-neon-green hover:bg-neon-green/90 active:scale-[0.98] text-brand-950 font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(57,255,20,0.2)] text-lg uppercase tracking-wider"
              >
                Gerar Pagamento PIX
                <ChevronRight className="w-6 h-6" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                <ShieldCheck className="w-4 h-4 text-neon-blue" /> Seguro
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo.png" alt="Pix" className="h-4 object-contain invert brightness-0" referrerPolicy="no-referrer" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Result Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-brand-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="p-8 lg:p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mb-8 border border-neon-green/20">
                  <QrCode className="w-10 h-10 text-neon-green" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Cód. Copiado</h3>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">Escaneie o QR Code ou use o botão para copiar o código do seu banco.</p>

                {/* QR Display */}
                <div className="p-8 bg-white rounded-3xl mb-10 relative group shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                  {pixData && (
                    <QRCodeSVG 
                      value={pixData.payload} 
                      size={200}
                      level="H"
                      includeMargin
                    />
                  )}
                  <div className="absolute inset-0 border-8 border-brand-900 rounded-3xl pointer-events-none" />
                </div>

                {/* Details Hub */}
                <div className="w-full bg-black/40 rounded-2xl p-6 mb-8 space-y-4 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Valor</span>
                    <strong className="text-gold-500 font-black text-xl">R$ {pixData?.amount.toFixed(2)}</strong>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                  <div className="flex justify-between items-center opacity-70">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Serviço</span>
                    <span className="text-neon-blue font-mono text-[10px]">AGUIA-V2.0-NIGHT</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full grid grid-cols-1 gap-4">
                  <button 
                    onClick={handleCopy}
                    className={cn(
                      "w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all relative overflow-hidden uppercase tracking-wider",
                      copyFeedback 
                        ? "bg-neon-green text-brand-950" 
                        : "bg-neon-blue text-brand-950 shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {copyFeedback ? (
                        <motion.span 
                          key="check" 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="flex items-center gap-2"
                        >
                          <Check className="w-6 h-6" /> Sucesso!
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="copy" 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-6 h-6" /> Copiar Link
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 rounded-xl text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase text-xs tracking-widest"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
