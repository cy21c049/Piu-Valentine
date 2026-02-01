import React, { useState, useEffect, useCallback } from 'react';
import FloatingHearts from './components/FloatingHearts';
import RunawayButton from './components/RunawayButton';
import CatImage from './components/CatImage';
import { generateValentinePoem } from './services/geminiService';
import confetti from 'canvas-confetti';

// Using the lh3.googleusercontent.com domain is often more reliable for direct image embedding 
// than the standard drive export link which can have redirect/CORS issues.
const VALENTINE_ASSET = "https://lh3.googleusercontent.com/d/1BWCGJu9of_wncLJe8xCDy4DLaKxN83_f";
const FALLBACK_ASSET = "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1000&auto=format&fit=crop";

const App: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [poem, setPoem] = useState<string | null>(null);
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [noCount, setNoCount] = useState(0);
  
  // Use the asset path as default, checking local storage for overrides
  const [customImage, setCustomImage] = useState<string | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('valentine_photo');
        if (stored) return stored;
      }
    } catch (e) {
      console.warn("LocalStorage access denied");
    }
    // Fallback to the static path
    return VALENTINE_ASSET;
  });

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        try {
          localStorage.setItem('valentine_photo', base64);
          setCustomImage(base64);
        } catch (e) {
          alert("The photo is a bit large to save permanently, but it will show for now!");
          setCustomImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleYes = async () => {
    setAccepted(true);
    setLoadingPoem(true);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff8fa3', '#fff0f3', '#ffb3c1']
    });

    // Fetch AI poem
    const generatedPoem = await generateValentinePoem();
    setPoem(generatedPoem);
    setLoadingPoem(false);
  };

  const handleNoRun = () => {
    setNoCount(prev => prev + 1);
  };

  // Grow the Yes button as the user tries to click No
  const yesButtonScale = 1 + (noCount * 0.1);

  if (accepted) {
    return (
      <div className="min-h-screen bg-[#fff0f3] flex flex-col items-center py-12 px-4 text-center">
        <FloatingHearts />
        <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl z-10 max-w-md w-full border-4 border-pink-200 animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-romantic text-pink-600 mb-6 animate-bounce">
            Yay! ❤️
          </h1>
          
          <div 
            className={`relative w-full max-w-[280px] md:max-w-[320px] mx-auto mb-6 transition-all duration-300 ${dragActive ? 'scale-105 ring-4 ring-pink-400' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Polaroid Effect */}
            <div className="bg-white p-3 pb-10 shadow-xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] border border-gray-200">
                    <img 
                      src={customImage || VALENTINE_ASSET} 
                      onError={(e) => {
                        // Fallback if the drive link fails
                        const target = e.currentTarget;
                        if (target.src !== FALLBACK_ASSET) {
                           target.src = FALLBACK_ASSET;
                        }
                      }}
                      alt="Us" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Drag Overlay */}
                    {dragActive && (
                        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center backdrop-blur-sm">
                            <p className="text-white font-bold text-xl drop-shadow-md">Drop it here! 📸</p>
                        </div>
                    )}
                </div>
                <div className="mt-4 font-romantic text-2xl text-gray-600 rotate-[1deg]">
                    Us ❤️
                </div>
            </div>
            
            {/* Upload Button Overlay - Subtle */}
            <label className="absolute -bottom-4 -right-4 bg-pink-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-pink-600 hover:scale-110 transition-all z-20" title="Change Photo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          
          <p className="text-xl text-pink-800 font-semibold mb-6 mt-6 leading-tight">
            You just made me the luckiest person alive!
          </p>
          
          {/* Poem Container - Updated for better text handling */}
          <div className="mt-4 p-8 bg-pink-50 rounded-2xl border-2 border-pink-100 italic text-pink-800 min-h-[120px] flex items-center justify-center relative shadow-sm">
            {loadingPoem ? (
              <div className="flex flex-col items-center gap-2">
                 <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
                 <span className="text-xs text-pink-400 not-italic">Writing a note...</span>
              </div>
            ) : (
              <p className="whitespace-pre-line leading-relaxed text-lg font-medium break-words w-full">
                {poem}
              </p>
            )}
          </div>

          <button 
            onClick={() => {
              setAccepted(false);
              setNoCount(0);
            }}
            className="mt-6 px-6 py-2 bg-white text-pink-500 border border-pink-200 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all text-sm font-semibold shadow-sm"
          >
            Play Again ↺
          </button>
        </div>
      </div>
    );
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-[#fff0f3] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      {/* Customization Button */}
      <label className="fixed top-4 right-4 z-50 cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm transition-all duration-300 text-pink-500 font-semibold text-sm flex items-center gap-2" title="Upload your photo for the success screen">
        <span>📷 Setup Photo</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
      
      <div className="z-10 text-center max-w-lg w-full">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300 inline-block">
          <CatImage className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full border-8 border-white shadow-2xl bg-white" />
        </div>

        <h1 className="text-4xl md:text-6xl font-romantic text-pink-600 mb-12 drop-shadow-sm px-4 leading-tight">
          Hi Piu,<br/>Will you be my Valentine?
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 relative min-h-[80px]">
          <button
            onClick={handleYes}
            style={{ 
              transform: `scale(${yesButtonScale})`,
              transformOrigin: 'center'
            }}
            className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xl rounded-full shadow-[0_6px_0_rgb(157,23,77)] hover:shadow-[0_4px_0_rgb(157,23,77)] transition-all active:translate-y-[6px] active:shadow-none min-w-[160px] z-10"
          >
            YES!
            <span className="absolute -top-4 -right-4 text-2xl group-hover:animate-ping">💖</span>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </button>

          <RunawayButton label="No..." onRun={handleNoRun} />
        </div>
      </div>

      <p className="fixed bottom-8 text-pink-300 text-sm italic z-0 animate-pulse">
        (Psst... There's no escaping my love!)
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;