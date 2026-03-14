import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Sparkles, RefreshCw, Check, ArrowRight, ShoppingBag, Info } from 'lucide-react';
import { generateTryOn } from './services/gemini';
import { CLOTHING_ITEMS, ClothingItem } from './constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedItem) return;

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTryOn(userImage, selectedItem.description);
      setResultImage(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate try-on. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setUserImage(null);
    setSelectedItem(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">VogueAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Collection</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Technology</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Retailers</a>
          </nav>
          <button className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
            Get Started
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Upload & Selection */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">01</span>
                <h2 className="text-2xl font-bold tracking-tight uppercase">Upload Your Photo</h2>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative aspect-[3/4] rounded-3xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-black/30 group",
                  userImage && "border-none"
                )}
              >
                {userImage ? (
                  <>
                    <img src={userImage} alt="User" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Change Photo</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="text-sm font-medium opacity-60 mb-1">Drag and drop or click to upload</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Full body or half body photo works best</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">02</span>
                <h2 className="text-2xl font-bold tracking-tight uppercase">Select Clothing</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CLOTHING_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                      selectedItem?.id === item.id ? "border-black scale-[0.98]" : "border-transparent hover:border-black/20"
                    )}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 text-left">
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">{item.category}</p>
                      <p className="text-xs text-white font-bold leading-tight">{item.name}</p>
                    </div>
                    {selectedItem?.id === item.id && (
                      <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <button
              disabled={!userImage || !selectedItem || isGenerating}
              onClick={handleTryOn}
              className={cn(
                "w-full py-6 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                !userImage || !selectedItem || isGenerating
                  ? "bg-black/5 text-black/20 cursor-not-allowed"
                  : "bg-black text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Try-On
                </>
              )}
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">03</span>
              <h2 className="text-2xl font-bold tracking-tight uppercase">The Result</h2>
            </div>

            <div className="relative aspect-[3/4] bg-white rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden border border-black/5">
              <AnimatePresence mode="wait">
                {resultImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                    <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                      <button className="flex-1 bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={reset}
                        className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="relative w-24 h-24 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-black/20 rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Sparkles className="w-8 h-8" />
                      </motion.div>
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-2">AI is working</h3>
                    <p className="text-sm opacity-40 max-w-[240px]">Analyzing body pose and warping fabric for a perfect fit...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center p-12 text-center opacity-20"
                  >
                    <ArrowRight className="w-12 h-12 mb-4 rotate-[-45deg]" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em]">Complete steps 1 & 2 to see the magic</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-medium border border-red-100 flex items-center gap-3">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-6 rounded-3xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Technology</p>
                <p className="text-xs font-medium leading-relaxed">Pose estimation & GAN-based fabric warping for realistic textures.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Retail Ready</p>
                <p className="text-xs font-medium leading-relaxed">Seamlessly integrate with your local fashion inventory.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-black/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase">VogueAI</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed mb-8">
              Empowering local fashion retailers with enterprise-grade AI virtual try-on technology. Reduce returns, increase confidence, and redefine the shopping experience.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest">Platform</p>
              <ul className="text-sm space-y-2 opacity-60">
                <li><a href="#" className="hover:opacity-100">Showcase</a></li>
                <li><a href="#" className="hover:opacity-100">Pricing</a></li>
                <li><a href="#" className="hover:opacity-100">API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest">Company</p>
              <ul className="text-sm space-y-2 opacity-60">
                <li><a href="#" className="hover:opacity-100">About</a></li>
                <li><a href="#" className="hover:opacity-100">Blog</a></li>
                <li><a href="#" className="hover:opacity-100">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest">Legal</p>
              <ul className="text-sm space-y-2 opacity-60">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-black/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
          <p>© 2026 VogueAI Technologies Inc.</p>
          <div className="flex gap-8">
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
