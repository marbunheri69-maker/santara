import React, { useState } from 'react';
import { Camera, Calendar, Flower, Layers, Heart, ShoppingBag, Eye, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryCustomization, CartItem } from '../types';

interface MemoryFrameCustomizerProps {
  productImage: string;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

const PRESET_MOMENTS = [
  { id: 'couple1', label: 'Sunset Stroll', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop' },
  { id: 'couple2', label: 'Cozy Coffee', url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&auto=format&fit=crop' },
  { id: 'couple3', label: 'Picnic Day', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop' }
];

export default function MemoryFrameCustomizer({ productImage, onAddToCart }: MemoryFrameCustomizerProps) {
  const [names, setNames] = useState('Farrel & Nazwa');
  const [wishMessage, setWishMessage] = useState('Selamat mengulang tahun hubungan kita yang ke-3. Terima kasih selalu menemani perjalananku!');
  const [flowerTone, setFlowerTone] = useState<'Aesthetic Pink' | 'Rustic Warm' | 'Calming Lilac' | 'Minimalist White'>('Aesthetic Pink');
  const [woodType, setWoodType] = useState<'Natural Oak' | 'Classic Walnut' | 'Warm Maple'>('Natural Oak');
  const [photoUrl, setPhotoUrl] = useState(PRESET_MOMENTS[0].url);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // File Upload handler for user's own memory photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemoryToCart = () => {
    const config: MemoryCustomization = {
      photoFile: photoUrl,
      names: names || 'Personal Memory',
      wishMessage: wishMessage || '"No message provided"',
      flowerTone,
      woodType
    };

    onAddToCart({
      productType: 'memory',
      productName: `Santara Memory Frame (${woodType})`,
      basePrice: 189000,
      quantity: 1,
      imageUrl: productImage,
      customizationDetails: {
        memory: config
      }
    });

    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-cream/60 rounded-3xl p-6 md:p-10 border border-brand-beige-200">
      
      {/* Visual Live Frame Preview (Left Column - Col-6) */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center">
        <label className="text-[11px] uppercase tracking-wider font-bold text-brand-brown-700 mb-4 block">
          👁️ LIVE PREVIEW MEMORY FRAME KAMU
        </label>

        {/* Outer Wood Frame Simulation depending on select choice */}
        <div 
          className={`relative w-full max-w-[320px] aspect-[4/5] rounded-3xl p-6 transition-all duration-500 shadow-2xl flex flex-col justify-between ${
            woodType === 'Natural Oak' 
              ? 'bg-[#E3C397] border-[16px] border-[#cbab7f] text-brand-brown-900 shadow-amber-900/10' 
              : woodType === 'Classic Walnut'
              ? 'bg-[#513627] border-[16px] border-[#392419] text-brand-beige-50 shadow-black/30'
              : 'bg-[#eccbb1] border-[16px] border-[#daaf90] text-brand-brown-900 shadow-rose-900/10'
          }`}
        >
          
          {/* Polaroid inner frame Card */}
          <div className="bg-brand-beige-100/90 rounded-2xl p-4 flex-1 flex flex-col justify-between shadow-inner relative overflow-hidden text-brand-brown-800">
            
            {/* Flower overlays dynamically rendered */}
            <div className="absolute top-0 right-0 z-20 pointer-events-none p-1">
              <AnimatePresence mode="wait">
                {flowerTone === 'Aesthetic Pink' && (
                  <motion.div
                    key="pink-flower"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-2xl animate-float">🌸</span>
                    <span className="text-base rotate-12">🌸</span>
                    <span className="text-xs text-brand-rose-300 font-serif lowercase bg-brand-rose-50/80 px-1.5 py-0.5 rounded shadow">sweet pink decor</span>
                  </motion.div>
                )}
                {flowerTone === 'Rustic Warm' && (
                  <motion.div
                    key="rustic-flower"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-2xl animate-float">🍂</span>
                    <span className="text-base">🌼</span>
                    <span className="text-xs text-amber-700 font-serif lowercase bg-amber-50/80 px-1.5 py-0.5 rounded shadow">autumn dried bunch</span>
                  </motion.div>
                )}
                {flowerTone === 'Calming Lilac' && (
                  <motion.div
                    key="lilac-flower"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-2xl animate-float">🪻</span>
                    <span className="text-base">💜</span>
                    <span className="text-xs text-purple-700 font-serif lowercase bg-purple-50/80 px-1.5 py-0.5 rounded shadow">calming lavender tone</span>
                  </motion.div>
                )}
                {flowerTone === 'Minimalist White' && (
                  <motion.div
                    key="white-flower"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-2xl animate-float">🤍</span>
                    <span className="text-base">🍃</span>
                    <span className="text-xs text-slate-700 font-serif lowercase bg-slate-50/80 px-1.5 py-0.5 rounded shadow">white wildflower list</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Polaroid photo inside polaroid design */}
            <div className="bg-white rounded p-2.5 shadow-md flex-1 flex flex-col justify-between pb-6">
              
              {/* Photo Area */}
              <div className="aspect-square w-full rounded overflow-hidden bg-brand-beige-50 relative group">
                <img
                  src={photoUrl}
                  alt="Couple Customizer Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Overlay upload suggestion on preview */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 cursor-pointer">
                  <Camera className="w-4 h-4 animate-bounce" />
                  <span>Ganti dengan Foto kustom</span>
                </div>
              </div>

              {/* Polaroid Names area */}
              <div className="mt-3 text-center space-y-1">
                <span className="text-[12px] font-semibold text-brand-brown-800 uppercase tracking-widest block font-sans">
                  💕 {names || 'NAMA PASANGAN / BESTIE'}
                </span>
                <span className="text-[9px] text-brand-brown-600 block italic font-serif">
                  handmade with botanical love
                </span>
              </div>

            </div>

            {/* Wishes text in high styled cursive/italic font at the bottom of the polaroid card */}
            <div className="mt-4 px-1.5 text-center">
              <p className="text-[11px] leading-relaxed italic text-brand-brown-900 border-t border-brand-brown-600/10 pt-2.5 font-serif max-h-[64px] overflow-hidden text-ellipsis line-clamp-3">
                "{wishMessage || 'Tulis ucapan penuh emosional dan cinta di samping...'}"
              </p>
            </div>

          </div>

          {/* Premium hanger indicator */}
          <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-8 h-2 bg-brand-brown-600/30 rounded" />
        </div>

        <p className="text-[11px] text-brand-brown-600 italic text-center mt-4">
          Visualisasi rancangan kustom Anda. Kayu kustom, rangkuman rute bunga kering asli, dan cetak foto premium terintegrasi langsung.
        </p>
      </div>

      {/* Workshop Control Panel (Right Column - Col-6) */}
      <div className="lg:col-span-6 flex flex-col space-y-5">
        
        {/* Custom Header Text */}
        <div className="border-b border-brand-beige-200 pb-3">
          <span className="text-xs text-brand-sunset-500 font-bold tracking-wider uppercase">Custom Handmade Gift</span>
          <h3 className="font-serif text-2xl font-semibold text-brand-brown-800 tracking-tight mt-1">SANTARA Memory Frame</h3>
          <p className="text-xs text-brand-brown-600 mt-1">
            Hadiah kustom premium untuk orang spesial. Dihias oleh tim floris kami secara handmade menggunakan bunga kering pilihan.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* Custom Photo Upload */}
          <div>
            <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-2">
              Langkah 1: Unggah Foto Spesial Kamu
            </label>
            <div className="flex gap-2">
              <label 
                htmlFor="photo-file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-brand-beige-300 hover:border-brand-sunset-400 bg-white hover:bg-brand-cream/30 p-3 rounded-2xl cursor-pointer text-center flex-1 transition-all"
              >
                <div className="flex items-center gap-1.5 text-brand-brown-800 font-medium text-xs">
                  <Upload className="w-4 h-4 text-brand-sunset-500" />
                  <span>Pilih Dari Laptop / HP</span>
                </div>
                <input
                  id="photo-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {/* Short Preset picker option */}
              <div className="flex flex-col justify-between scrollbar-none max-h-[46px] overflow-x-auto">
                <div className="flex gap-1">
                  {PRESET_MOMENTS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      id={`moment-preset-${m.id}`}
                      onClick={() => setPhotoUrl(m.url)}
                      className={`px-2 py-1.5 text-[9px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        photoUrl === m.url 
                          ? 'bg-brand-brown-800 text-white border-brand-brown-800' 
                          : 'bg-white text-brand-brown-700 border-brand-beige-200 hover:bg-brand-beige-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Names Inputs */}
          <div>
            <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
              Langkah 2: Nama Pasangan / Sahabat / Keluarga
            </label>
            <input
              id="memory-custom-names"
              type="text"
              placeholder="Contoh: Rian & Shinta (Maks. 30 karakter)"
              maxLength={30}
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400"
            />
          </div>

          {/* Special Greetings Text */}
          <div>
            <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
              Langkah 3: Tulis Ucapan Hangat / Wish Istimewa
            </label>
            <textarea
              id="memory-custom-message"
              rows={2}
              maxLength={150}
              placeholder="Contoh: Happy 1st Anniversary! Thank you for staying beside me in all seasons of my life. I love you!"
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400 resize-none"
            />
            <div className="text-[9px] text-right text-brand-brown-600 mt-1">
              {wishMessage.length}/150 Karakter
            </div>
          </div>

          {/* Double Select options in horizontal structure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Langkah 4: Tone Bunga Kering
              </label>
              <select
                id="memory-flower-select"
                value={flowerTone}
                onChange={(e) => setFlowerTone(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400"
              >
                <option value="Aesthetic Pink">Sweet Pink (Romantis)</option>
                <option value="Rustic Warm">Rustic Warm (Estetis)</option>
                <option value="Calming Lilac">Calming Lilac (Elegan)</option>
                <option value="Minimalist White">Minimalist White (Clean)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Langkah 5: Varian Kayu Bingkai
              </label>
              <select
                id="memory-wood-select"
                value={woodType}
                onChange={(e) => setWoodType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400"
              >
                <option value="Natural Oak">Natural Oak (Kuning Kayu)</option>
                <option value="Classic Walnut">Classic Walnut (Coklat Tua)</option>
                <option value="Warm Maple">Warm Soft Rosewood (Kemerahan)</option>
              </select>
            </div>
          </div>

          {/* Footer of card section with CTA action */}
          <div className="pt-2 border-t border-brand-beige-200 flex justify-between items-center bg-brand-cream/40 p-4 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[10px] text-brand-brown-600 block">Harga Terpasang</span>
              <span className="font-serif text-lg font-bold text-brand-brown-800 block">Rp 189.000</span>
            </div>
            
            <button
              id="add-memory-to-cart-btn"
              onClick={handleAddMemoryToCart}
              disabled={isAddedToCart}
              className={`py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isAddedToCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-brand-brown-800 hover:bg-brand-brown-950 text-white shadow'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isAddedToCart ? 'Berasil Ditambahkan! ✨' : 'Buat Kenanganmu'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
