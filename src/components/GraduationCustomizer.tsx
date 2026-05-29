import React, { useState } from 'react';
import { Award, School, Sparkles, MessageSquare, ShoppingBag, Upload, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { GraduationCustomization, CartItem } from '../types';

interface GraduationCustomizerProps {
  productImage: string;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

const GRAD_PRESETS = [
  { id: 'grad_m', label: 'Male Graduate', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop' },
  { id: 'grad_f', label: 'Female Graduate', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop' }
];

export default function GraduationCustomizer({ productImage, onAddToCart }: GraduationCustomizerProps) {
  const [gradName, setGradName] = useState('Farrel Nazwa Utama');
  const [degree, setDegree] = useState('S.Kom.');
  const [university, setUniversity] = useState('Universitas Indonesia');
  const [specialMessage, setSpecialMessage] = useState('Congratulations on your graduation! May this milestone be the launching pad to your grandest dreams and success.');
  const [plaqueStyle, setPlaqueStyle] = useState<'Classic Clear' | 'Frosted Aesthetic' | 'Chic Wood Accent'>('Classic Clear');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(GRAD_PRESETS[1].url);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

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

  const handleAddGraduationToCart = () => {
    const config: GraduationCustomization = {
      gradName,
      university,
      degree,
      specialMessage,
      plaqueStyle,
      hasPhoto,
      photoFile: photoUrl
    };

    onAddToCart({
      productType: 'graduation',
      productName: `Santara Graduation Acrylic Plaque (${plaqueStyle})`,
      basePrice: 169000,
      quantity: 1,
      imageUrl: productImage,
      customizationDetails: {
        graduation: config
      }
    });

    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-cream/60 rounded-3xl p-6 md:p-10 border border-brand-beige-200">
      
      {/* Visual Plaque Preview (Left Column - Col-5) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center">
        <label className="text-[11px] uppercase tracking-wider font-bold text-brand-brown-700 mb-4 block">
          👁️ LIVE PREVIEW PLAKAT AKRILIK
        </label>

        {/* Acrylic structure mockup */}
        <div className="relative w-full max-w-[280px] aspect-[1/1.4] flex flex-col items-center select-none">
          
          {/* Main Acrylic Body */}
          <div 
            className={`w-[92%] flex-1 rounded-2xl p-5 border shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 z-10 ${
              plaqueStyle === 'Classic Clear' 
                ? 'glass-beige border-white/70 shadow-amber-900/5' 
                : plaqueStyle === 'Frosted Aesthetic'
                ? 'bg-white/80 backdrop-filter blur-md border-white/90 shadow-slate-900/5'
                : 'glass-beige border-amber-900/10 shadow-amber-900/5'
            }`}
          >
            {/* Elegant glass refraction shine lines */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-transparent via-white/10 to-white/40 pointer-events-none transform -skew-x-12 z-0" />

            {/* University Logo Mock / Academic emblem */}
            <div className="flex flex-col items-center text-center space-y-0.5 z-10">
              <div className="w-10 h-10 rounded-full border border-brand-brown-700/20 bg-brand-cream/80 flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5 text-brand-sunset-500" />
              </div>
              <span className="text-[8px] font-bold text-brand-brown-800 uppercase tracking-widest mt-1">
                {university || 'UNIVERSITAS PILIHAN'}
              </span>
              <div className="w-12 h-0.5 bg-brand-sunset-400 mt-1" />
            </div>

            {/* Custom Graduate Photo */}
            {hasPhoto && (
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-white drop-shadow-md z-10 my-1 bg-brand-cream relative group">
                <img
                  src={photoUrl}
                  alt="Graduate Customization Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] transition-opacity cursor-pointer">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
            )}

            {/* Graduate Details Name */}
            <div className="text-center z-10 space-y-0.5 mt-2">
              <h5 className="font-serif text-[13px] font-black tracking-wide text-brand-brown-900">
                {gradName || 'NAMA LENGKAP WISUDAWAN'}
              </h5>
              <p className="text-[9px] font-mono font-medium text-brand-sunset-500 uppercase tracking-widest">
                {degree || 'GELAR (S.T. / S.E. / DLL)'}
              </p>
            </div>

            {/* Special Greetings message */}
            <div className="text-center font-serif text-[8.5px] leading-relaxed italic text-brand-brown-700 font-medium border-t border-brand-brown-800/10 pt-2 z-10 max-h-[50px] overflow-hidden text-ellipsis line-clamp-3">
              "{specialMessage || 'Tulis ucapan selamat dan harapan istimewa di samping...'}"
            </div>

            <div className="text-center text-[7.5px] tracking-widest uppercase font-sans font-bold text-brand-brown-600/60 mt-1 z-10">
              SANTARA MODERN ACRYLIC ART
            </div>

          </div>

          {/* Plaque Solid Wood Standee base block */}
          <div 
            className={`w-full h-8 rounded-b-xl border-t z-20 flex items-center justify-center transition-colors duration-500 ${
              plaqueStyle === 'Chic Wood Accent'
                ? 'bg-[#513627] border-[#392419] shadow-md shadow-amber-900/20'
                : 'bg-[#caaa8b] border-[#ae8e71] shadow-md shadow-brand-brown-950/10'
            }`}
          >
            <div className="w-[85%] h-1 bg-black/10 rounded-full blur-xs" />
          </div>

          {/* Mini shadow under timber base */}
          <div className="w-[95%] h-2 bg-brand-brown-900/10 rounded-full blur-md" />

        </div>

        <p className="text-[11px] text-brand-brown-600 italic text-center mt-4">
          Tampilan plakat akrilik tebal (8mm) dengan ukiran laser modern dan cetak resolusi tinggi anti-pudar.
        </p>

      </div>

      {/* Inputs Form Control Panel (Right Column - Col-7) */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        
        {/* Custom Header Text */}
        <div className="border-b border-brand-beige-200 pb-3">
          <span className="text-xs text-brand-sunset-500 font-bold tracking-wider uppercase">Luxury Modern Acrylic</span>
          <h3 className="font-serif text-2xl font-semibold text-brand-brown-800 tracking-tight mt-1">SANTARA Acrylic Graduation Frame</h3>
          <p className="text-xs text-brand-brown-600 mt-1">
            Rayakan pencapaian wisuda berharga bagi sahabat, pacar, atau anak dengan plakat akrilik kustom mewah yang awet dipajang seumur hidup.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Graduate Name */}
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Langkah 1: Nama Lengkap Wisudawan
              </label>
              <input
                id="grad-custom-name"
                type="text"
                maxLength={45}
                placeholder="Contoh: Farrel Nazwa Utama"
                value={gradName}
                onChange={(e) => setGradName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400"
              />
            </div>

            {/* Degree Title */}
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Gelar Akademis
              </label>
              <input
                id="grad-custom-title"
                type="text"
                maxLength={20}
                placeholder="Contoh: S.Kom. / S.T. / M.B.A."
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* School / Uni */}
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Langkah 2: Nama Universitas / Lembaga
              </label>
              <input
                id="grad-custom-university"
                type="text"
                maxLength={35}
                placeholder="Contoh: Universitas Indonesia"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400"
              />
            </div>

            {/* Model Plaque style select */}
            <div>
              <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
                Langkah 3: Tipe Desain Akrilik
              </label>
              <select
                id="grad-plaque-style"
                value={plaqueStyle}
                onChange={(e) => setPlaqueStyle(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400"
              >
                <option value="Classic Clear">Classic Clear Glass (Tembus Pandang Bening)</option>
                <option value="Frosted Aesthetic">Frosted Aesthetic (Latar Susu Kabur)</option>
                <option value="Chic Wood Accent">Chic Wood Base (Penyangga Kayu Walnut Gelap)</option>
              </select>
            </div>
          </div>

          {/* Photo configurations */}
          <div className="bg-white/40 p-3 rounded-2xl border border-brand-beige-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider">
                Langkah 4: Sematkan Foto Wisuda
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  id="grad-photo-toggle"
                  type="checkbox"
                  checked={hasPhoto}
                  onChange={(e) => setHasPhoto(e.target.checked)}
                  className="rounded text-brand-sunset-500 focus:ring-brand-sunset-400"
                />
                <span className="text-xs text-brand-brown-800 font-semibold select-none">Pakai Foto Wisudawan</span>
              </label>
            </div>

            {hasPhoto && (
              <div className="flex gap-2">
                <label 
                  htmlFor="grad-photo-file-upload"
                  className="flex flex-col items-center justify-center border border-dashed border-brand-beige-300 hover:border-brand-sunset-400 bg-white hover:bg-brand-cream/30 p-2.5 rounded-xl cursor-pointer text-center flex-1 transition-all"
                >
                  <div className="flex items-center gap-1 text-brand-brown-800 font-medium text-xs">
                    <Upload className="w-3.5 h-3.5 text-brand-sunset-500" />
                    <span>Upload Portrait</span>
                  </div>
                  <input
                    id="grad-photo-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-1 overflow-x-auto items-center">
                  {GRAD_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      id={`grad-preset-${p.id}`}
                      onClick={() => setPhotoUrl(p.url)}
                      className={`px-2 py-1.5 text-[9px] font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        photoUrl === p.url 
                          ? 'bg-brand-brown-800 text-white border-brand-brown-800' 
                          : 'bg-white text-brand-brown-700 border-brand-beige-200 hover:bg-brand-beige-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Congratulation text wishes */}
          <div>
            <label className="block text-[10px] font-bold text-brand-brown-700 uppercase tracking-wider mb-1">
              Langkah 5: Tulis Ucapan Selamat Graduation
            </label>
            <textarea
              id="grad-custom-message-text"
              rows={2}
              maxLength={120}
              placeholder="Contoh: Happy graduation! So proud of your hard work and achievements. May your next chapter be brighter than ever!"
              value={specialMessage}
              onChange={(e) => setSpecialMessage(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-brand-beige-200 rounded-xl bg-white text-brand-brown-800 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 focus:border-brand-sunset-400 resize-none"
            />
            <div className="text-[9px] text-right text-brand-brown-600 mt-1">
              {specialMessage.length}/120 Karakter
            </div>
          </div>

          {/* Add to Cart checkout bar */}
          <div className="pt-2 border-t border-brand-beige-200 flex justify-between items-center bg-brand-cream/40 p-4 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[10px] text-brand-brown-600 block">Harga Akrilik</span>
              <span className="font-serif text-lg font-bold text-brand-brown-800 block">Rp 169.000</span>
            </div>
            
            <button
              id="add-grad-to-cart-btn"
              onClick={handleAddGraduationToCart}
              disabled={isAddedToCart}
              className={`py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isAddedToCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-brand-brown-800 hover:bg-brand-brown-950 text-white shadow'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isAddedToCart ? 'Berhasil Ditambahkan! ✨' : 'Rayakan Kelulusan'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
