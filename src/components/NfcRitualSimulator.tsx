import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Sparkles, Music, Star, Volume2, BookOpen, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NfcCustomization, CartItem } from '../types';

interface NfcRitualSimulatorProps {
  productImage: string;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

const AFFIRMATIONS = [
  "Tarik napas dalam-dalam, lepaskan hari ini. Anda telah melakukan yang terbaik.",
  "Malam ini adalah waktu bagi tubuh dan pikiranmu untuk beristirahat tanpa beban.",
  "Setiap hari membawa awal baru. Esok akan dipenuhi dengan kedamaian dan peluang baru.",
  "Dunia bisa menunggu, sekarang adalah momen sakralmu untuk menyembuhkan diri.",
  "Biarkan ketegangan meleleh. Kamu aman, dicintai, dan berhak mendapatkan tidur yang nyenyak.",
  "Suara malam berbisik bahwa semua kekhawatiranmu perlahan menguap."
];

const PLAYLIST_OPTIONS = [
  { name: "Santara Soothing Rain", mood: "Calm Acoustic & Raindrops", duration: "120 m" },
  { name: "Deep Sleep Frequencies", mood: "528Hz Solfeggio Meditation", duration: "180 m" },
  { name: "Cozy Bedroom Lo-Fi", mood: "Soft Vintage Chords", duration: "90 m" },
  { name: "Celestial Deep Breath", mood: "Slow Pad Synthesizer", duration: "60 m" }
];

export default function NfcRitualSimulator({ productImage, onAddToCart }: NfcRitualSimulatorProps) {
  // NFC simulation state
  const [isTapped, setIsTapped] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlist' | 'affirmation' | 'sound' | 'journal'>('playlist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLIST_OPTIONS[0]);
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [soundType, setSoundType] = useState<'hujan' | 'pantai' | 'hutan' | 'api-unggun'>('hujan');
  const [journalText, setJournalText] = useState('');
  const [savedJournalCount, setSavedJournalCount] = useState(0);
  const [customAffirmativeText, setCustomAffirmativeText] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Audio synthesis state for relaxing environment
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  const handleNextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const simulateTap = () => {
    setIsTapped(true);
    // Smooth scroll option if necessary
  };

  // Safe Web Audio Synth for White/Pink/Brown relaxing ambient sounds
  const toggleAmbientSound = () => {
    if (isPlayingSynth) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Create a customized procedural noise generator to mimic rainfall/ocean/nature
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise brownian motion filter (more warm and cozy than harsh white noise)
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain multiplier
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter to shape sound depending on type
      const biquadFilter = ctx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      
      if (soundType === 'hujan') {
        biquadFilter.frequency.value = 800; // soft raindrops
      } else if (soundType === 'pantai') {
        biquadFilter.frequency.value = 500; // deep oceanic swell
      } else if (soundType === 'hutan') {
        biquadFilter.frequency.value = 1200; // breezy leaves
      } else if (soundType === 'api-unggun') {
        biquadFilter.frequency.value = 600; // warmth crackle
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

      noiseSource.connect(biquadFilter);
      biquadFilter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      
      noiseNodeRef.current = noiseSource;
      filterNodeRef.current = biquadFilter;
      setIsPlayingSynth(true);
    } catch (e) {
      console.warn("Web Audio is not supported or needs interactions first.", e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch (e) {}
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    noiseNodeRef.current = null;
    filterNodeRef.current = null;
    audioContextRef.current = null;
    setIsPlayingSynth(false);
  };

  // Update filter frequency when user changes sound types while playing
  useEffect(() => {
    if (isPlayingSynth && filterNodeRef.current) {
      const f = filterNodeRef.current;
      if (soundType === 'hujan') {
        f.frequency.setValueAtTime(800, audioContextRef.current!.currentTime);
      } else if (soundType === 'pantai') {
        f.frequency.setValueAtTime(500, audioContextRef.current!.currentTime);
      } else if (soundType === 'hutan') {
        f.frequency.setValueAtTime(1100, audioContextRef.current!.currentTime);
      } else if (soundType === 'api-unggun') {
        f.frequency.setValueAtTime(600, audioContextRef.current!.currentTime);
      }
    }
  }, [soundType]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleSaveJournalLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    setSavedJournalCount(prev => prev + 1);
    setJournalText('');
  };

  const handleAddNfcToCart = () => {
    const config: NfcCustomization = {
      playlistName: selectedPlaylist.name,
      playlistUrl: "https://open.spotify.com/playlist/santara-dream",
      nightAffirmation: customAffirmativeText || AFFIRMATIONS[affirmationIdx],
      whiteNoise: soundType,
      hasJournal: true
    };

    onAddToCart({
      productType: 'nfc',
      productName: 'SANTARA NFC Sleep Ritual Moon Lamp',
      basePrice: 229000,
      quantity: 1,
      imageUrl: productImage,
      customizationDetails: {
        nfc: config
      }
    });

    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-cream/60 rounded-3xl p-6 md:p-10 border border-brand-beige-200">
      
      {/* Lamp Interactive Section (Left / Co-6) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center relative space-y-6">
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-brand-brown-800 text-white px-2.5 py-1 rounded-full">
            ✨ Smart NFC
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-brand-beige-300 text-brand-brown-800 px-2.5 py-1 rounded-full">
            🧠 Sleep Ritual
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-brand-beige-200 text-brand-brown-700 px-2.5 py-1 rounded-full">
            🌙 Aesthetic Room Decor
          </span>
        </div>

        {/* Lamp container with interactive effects */}
        <div className="relative w-full max-w-[360px] aspect-square rounded-full flex items-center justify-center bg-radial from-brand-beige-200/40 via-transparent to-transparent">
          
          {/* Animated Warm Glow behind moon */}
          <AnimatePresence>
            {isTapped && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute w-72 h-72 rounded-full bg-brand-sunset-400/25 blur-3xl animate-breathing-glow"
              />
            )}
          </AnimatePresence>

          {/* Actual moon lamp mockup */}
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
            <motion.img
              src={productImage}
              alt="Lunar Lamp"
              referrerPolicy="no-referrer"
              animate={isTapped ? { y: [-4, 4, -4] } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className={`w-[85%] h-[85%] object-contain rounded-full transition-all duration-1000 ${
                isTapped ? 'drop-shadow-[0_0_35px_rgba(242,204,168,0.7)] scale-102 filter brightness-105' : 'drop-shadow-lg filter brightness-95'
              }`}
            />

            {/* Glowing Engraved Brand Tag */}
            <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/10 px-2 py-0.5 rounded text-[10px] text-brand-beige-200/60 font-serif font-black tracking-widest pointer-events-none">
              SANTARA
            </div>
          </div>

          {/* Floating phone ready to scan */}
          <AnimatePresence>
            {!isTapped && (
              <motion.div
                initial={{ x: -100, y: 100, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: 100, y: -100, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                onClick={simulateTap}
                className="absolute z-20 top-1/4 right-[5%] cursor-pointer glass-beige px-3 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 border border-brand-beige-200/50 pointer-events-auto"
              >
                <Smartphone className="w-4 h-4 text-brand-sunset-500 animate-pulse" />
                <span className="text-[10px] font-bold text-brand-brown-800">Sentuhkan HP disini</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action triggers */}
        <div className="text-center max-w-sm space-y-3">
          <p className="text-xs text-brand-brown-600 leading-relaxed">
            Dekatkan HP kamu yang berfitur NFC ke logo <span className="font-semibold text-brand-brown-800">SANTARA</span> di dasar kayu lampu, dan saksikan keajaiban malam mengalir di layar ponselmu.
          </p>
          <div className="flex justify-center gap-3">
            <button
              id="tap-light-sensor"
              onClick={simulateTap}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isTapped 
                ? 'bg-brand-sunset-400 text-brand-brown-900 shadow-md' 
                : 'bg-brand-brown-800 hover:bg-brand-brown-950 text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {isTapped ? 'Lampu Menyala!' : 'Simulasikan Tap HP'}
            </button>

            {isTapped && (
              <button
                id="reset-light-sensor"
                onClick={() => {
                  setIsTapped(false); 
                  stopAmbientSound();
                }}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-brand-brown-700 bg-brand-beige-200 hover:bg-brand-beige-300 transition-all cursor-pointer"
              >
                Matikan Lampu
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Virtual Smartphone Interface (Right / Col-5) */}
      <div className="lg:col-span-5 flex flex-col">
        <label className="text-[11px] uppercase tracking-wider font-bold text-brand-brown-700 mb-2 block text-center lg:text-left">
          {isTapped ? '📱 LAYAR PONSEL SENYUM KAMU' : '✨ COBA SIMULASI NFC TERLEBIH DAHULU'}
        </label>

        {/* Smartphone Shell with light/dark theme depending on lamp state */}
        <div className="relative mx-auto lg:mx-0 w-[280px] sm:w-[320px] aspect-[9/18.5] rounded-[40px] border-[10px] border-brand-brown-800 bg-brand-brown-900 p-3 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Notch indicator */}
          <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-brand-brown-800 rounded-full z-30 flex items-center justify-around px-4">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-brown-900" />
            <div className="w-10 h-1 bg-brand-brown-900 rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            {!isTapped ? (
              /* Idle screen telling instructions */
              <motion.div
                key="idle-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-brand-brown-900 text-brand-beige-100 z-10"
              >
                <div className="p-3 bg-brand-brown-800 rounded-full mb-3 animate-float">
                  <Smartphone className="w-8 h-8 text-brand-sunset-400" />
                </div>
                <h5 className="font-serif text-base font-semibold leading-relaxed">
                  Sentuhkan HP Anda Ke Lampu Bulan
                </h5>
                <p className="text-[11px] text-brand-beige-300/80 mt-2 max-w-[200px]">
                  Saat NFC terdeteksi, ponsel kustom Anda otomatis membuka portal ritual tidur yang menenangkan.
                </p>
                <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-brand-sunset-400 font-semibold uppercase tracking-wider animate-pulse cursor-pointer" onClick={simulateTap}>
                  <span>Tap Sekarang</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ) : (
              /* Inside the Sleep Ritual Hub (Phone App opened via NFC tag) */
              <motion.div
                key="active-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col bg-brand-brown-950 text-brand-beige-100 p-2.5 pt-6 z-10"
              >
                {/* Simulated Header */}
                <div className="flex justify-between items-center px-1 mb-2">
                  <span className="font-serif text-[13px] font-black tracking-widest text-brand-sunset-400">
                    SANTARA
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-brown-800/80 text-[9px] font-bold text-brand-sunset-400">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                    <span>NFC Link Active</span>
                  </div>
                </div>

                {/* Simulated Mini App Navigation */}
                <div className="grid grid-cols-4 gap-1 mb-3 bg-brand-brown-900/50 p-1 rounded-xl">
                  {[
                    { id: 'playlist', label: 'Music', icon: Music },
                    { id: 'affirmation', label: 'Mind', icon: Heart },
                    { id: 'sound', label: 'Sound', icon: Volume2 },
                    { id: 'journal', label: 'Write', icon: BookOpen },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        id={`simulator-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-brand-brown-700 text-brand-sunset-400'
                            : 'text-brand-beige-300 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-1" />
                        <span className="text-[8px] font-bold tracking-wider">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Active Screen View */}
                <div className="flex-1 flex flex-col bg-brand-brown-900/40 rounded-xl p-3 border border-brand-brown-800/40 overflow-hidden relative">
                  
                  {activeTab === 'playlist' && (
                    <div className="flex-1 flex flex-col justify-between text-center">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-brand-sunset-400 font-bold">Sleep Playlist</span>
                        <h6 className="text-[13px] font-serif font-semibold">{selectedPlaylist.name}</h6>
                        <p className="text-[10px] text-brand-beige-300/70">{selectedPlaylist.mood}</p>
                      </div>

                      {/* Disc spinning illustration */}
                      <div className="my-2 flex justify-center">
                        <div className="relative w-20 h-20 rounded-full border border-brand-brown-800 flex items-center justify-center p-1 bg-gradient-to-tr from-brand-brown-900 to-brand-sunset-500/20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                            className="w-full h-full rounded-full bg-brand-brown-950 flex items-center justify-center border-2 border-brand-brown-900 relative"
                          >
                            <div className="w-6 h-6 rounded-full bg-brand-sunset-400 flex items-center justify-center">
                              <Star className="w-3 h-3 text-brand-brown-900 fill-brand-brown-900" />
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Selection options */}
                      <div className="space-y-1 overflow-y-auto max-h-[80px] p-0.5">
                        {PLAYLIST_OPTIONS.map((opt) => (
                          <div
                            key={opt.name}
                            onClick={() => setSelectedPlaylist(opt)}
                            className={`flex justify-between items-center p-1 px-2 rounded-lg text-left text-[9px] cursor-pointer transition-colors ${
                              selectedPlaylist.name === opt.name 
                              ? 'bg-brand-brown-800 text-brand-sunset-400 border border-brand-sunset-400/20' 
                              : 'hover:bg-brand-brown-800/50 text-brand-beige-300'
                            }`}
                          >
                            <span className="truncate max-w-[150px] font-medium">{opt.name}</span>
                            <span className="opacity-60">{opt.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'affirmation' && (
                    <div className="flex-1 flex flex-col justify-between text-center">
                      <span className="text-[9px] uppercase tracking-wider text-brand-sunset-400 font-bold">Evening Affirmation</span>
                      
                      <div className="px-1 py-2 flex flex-col justify-center items-center my-auto">
                        <p className="text-[11px] leading-relaxed italic font-serif text-brand-beige-200">
                          "{AFFIRMATIONS[affirmationIdx]}"
                        </p>
                      </div>

                      <button
                        id="next-affirmation-btn"
                        onClick={handleNextAffirmation}
                        className="w-full py-1.5 bg-brand-brown-800 hover:bg-brand-brown-700 text-brand-sunset-400 rounded-lg text-[9px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        Ganti Afirmasi
                      </button>
                    </div>
                  )}

                  {activeTab === 'sound' && (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="text-center space-y-1 mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-brand-sunset-400 font-bold text-center block">White Noise Machine</span>
                        <p className="text-[10px] text-brand-beige-200/80">Tenangkan pernapasan, ikuti harmonisasi suara.</p>
                      </div>

                      {/* Interactive synthesized white noise controls */}
                      <div className="grid grid-cols-2 gap-1.5 my-auto">
                        {[
                          { id: 'hujan', label: 'Suara Hujan', desc: 'Rintik rintik tenang' },
                          { id: 'pantai', label: 'Deru Pantai', desc: 'Deburan ombak' },
                          { id: 'hutan', label: 'Angin Hutan', desc: 'Suara dedaunan' },
                          { id: 'api-unggun', label: 'Api Unggun', desc: 'Kayu terbakar hangat' },
                        ].map((sound) => (
                          <div
                            key={sound.id}
                            onClick={() => setSoundType(sound.id as any)}
                            className={`p-2 rounded-xl text-left border cursor-pointer transition-all duration-300 ${
                              soundType === sound.id 
                              ? 'bg-brand-brown-800/80 border-brand-sunset-400 text-brand-sunset-400 shadow-sm'
                              : 'bg-brand-brown-950/40 border-brand-brown-800 text-brand-beige-300'
                            }`}
                          >
                            <h6 className="text-[9px] font-bold">{sound.label}</h6>
                            <span className="text-[7px] opacity-70 block">{sound.desc}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        id="play-sound-synth"
                        onClick={toggleAmbientSound}
                        className={`w-full py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-2 ${
                          isPlayingSynth 
                          ? 'bg-brand-sunset-400 text-brand-brown-950 shadow-md animate-pulse' 
                          : 'bg-brand-brown-800 text-brand-beige-200 hover:bg-brand-brown-700'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingSynth ? 'animate-bounce' : ''}`} />
                        {isPlayingSynth ? 'Matikan Suara Damai' : 'Nyalakan Suara Damai'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'journal' && (
                    <form onSubmit={handleSaveJournalLocal} className="flex-1 flex flex-col justify-between">
                      <div className="text-center space-y-1 mb-1">
                        <span className="text-[9px] uppercase tracking-wider text-brand-sunset-400 font-bold block">Pelepasan Pikiran</span>
                        <p className="text-[8px] text-brand-beige-300">Tuliskan 1 hal yang kamu syukuri hari ini sebelum tidur.</p>
                      </div>

                      <textarea
                        rows={3}
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Malam ini aku bersyukur atas..."
                        className="w-full text-[10px] p-2 rounded-lg bg-brand-brown-950 border border-brand-brown-800 text-brand-beige-100 placeholder-brand-beige-300/40 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 resize-none flex-1 mb-2"
                      />

                      <div className="flex justify-between items-center">
                        <span className="text-[8px] text-brand-sunset-400/80">
                          📓 {savedJournalCount} catatan tersimpan
                        </span>
                        <button
                          id="submit-journal-btn"
                          type="submit"
                          className="px-2.5 py-1 bg-brand-sunset-400 hover:bg-brand-sunset-500 text-brand-brown-950 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        >
                          Simpan Jurnal
                        </button>
                      </div>
                    </form>
                  )}

                </div>

                {/* Simulated Home Indicator Swipe bar */}
                <div className="w-16 h-1 mt-3 bg-brand-beige-100/30 rounded-full mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Personalized configuration form for Cart */}
        <div className="mt-6 flex flex-col space-y-4 bg-brand-cream/40 p-5 rounded-2xl border border-brand-beige-200">
          <div className="border-b border-brand-beige-100 pb-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] text-brand-sunset-500 font-bold tracking-wide">Kustomisasi Untuk Kamarmu</span>
                <h4 className="font-serif text-lg font-bold text-brand-brown-800">SANTARA NFC Moon Lamp</h4>
              </div>
              <span className="font-serif text-base font-bold text-brand-brown-800">Rp 229.000</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Tulis Afirmasi Kustom Kamu (Opsional)
              </label>
              <input
                id="custom-affirmation"
                type="text"
                maxLength={90}
                placeholder="Biarkan kosong untuk default: 'Tarik napas dalam-dalam...'"
                value={customAffirmativeText}
                onChange={(e) => setCustomAffirmativeText(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-brand-beige-200 rounded-xl bg-brand-cream/40 text-brand-brown-800 placeholder-brand-brown-300 focus:outline-none focus:ring-1 focus:ring-brand-sunset-500 focus:border-brand-sunset-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                  Playlist Default
                </label>
                <select
                  id="select-nfc-playlist"
                  value={selectedPlaylist.name}
                  onChange={(e) => {
                    const pl = PLAYLIST_OPTIONS.find(o => o.name === e.target.value);
                    if (pl) setSelectedPlaylist(pl);
                  }}
                  className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-brand-cream/40 text-brand-brown-800 text-ellipsis focus:outline-none focus:ring-1 focus:ring-brand-sunset-500 focus:border-brand-sunset-500"
                >
                  {PLAYLIST_OPTIONS.map(o => (
                    <option key={o.name} value={o.name}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                  Preset Ambient Suara
                </label>
                <select
                  id="select-nfc-ambient"
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-brand-cream/40 text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-500 focus:border-brand-sunset-500"
                >
                  <option value="hujan">Suara Hujan</option>
                  <option value="pantai">Suara Pantai</option>
                  <option value="hutan">Suara Angin Hutan</option>
                  <option value="api-unggun">Suara Api Unggun</option>
                </select>
              </div>
            </div>

            <button
              id="add-nfc-to-cart-btn"
              onClick={handleAddNfcToCart}
              disabled={isAddedToCart}
              className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isAddedToCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-brand-brown-800 hover:bg-brand-brown-950 text-white shadow'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isAddedToCart ? 'Berasil Ditambahkan! ✨' : 'Masukkan ke Keranjang (Rp 229.000)'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
