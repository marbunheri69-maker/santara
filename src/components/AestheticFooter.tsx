import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Heart } from 'lucide-react';

interface AestheticFooterProps {
  onNavigateWorkspace?: (tabId: 'nfc' | 'memory' | 'graduation') => void;
}

export default function AestheticFooter({ onNavigateWorkspace }: AestheticFooterProps) {
  return (
    <footer className="relative bg-gradient-to-br from-indigo-950 via-slate-950 to-sky-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Garis Pembatas Smooth */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Konten Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                SANTARA
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              SANTARA adalah brand dekorasi kamar & hadiah personal kustom premium. Kami berdedikasi menghadirkan kehangatan dan keindahan seni handmade ke dalam setiap ruangan Anda.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/santara_web?igsh=MTRkMHo4N3dkaXlyMw==" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-white/5 hover:bg-pink-500/20 rounded-full transition-all duration-300 border border-white/5 hover:border-pink-500/50"
              >
                <FaInstagram className="w-4 h-4 text-pink-500" />
              </a>
              <a 
                href="https://wa.me/6281991618323" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-white/5 hover:bg-emerald-500/20 rounded-full transition-all duration-300 border border-white/5 hover:border-emerald-500/50"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Brand Directory */}
          <div className="lg:col-span-5 space-y-3">
            <h5 className="font-serif text-sm font-semibold text-sky-400 tracking-wider uppercase">
              Brand Directory
            </h5>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <li><a href="#koleksi" className="hover:text-white transition-colors">Semua Koleksi</a></li>
              <li><a href="#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#manfaat" className="hover:text-white transition-colors">Manfaat</a></li>
              <li><a href="#tujuan" className="hover:text-white transition-colors">Tujuan</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Keunggulan Handmade</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright & Bottom Info */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 font-medium space-y-3 md:space-y-0">
          <p>© 2026 SANTARA Creative. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Handmade with</span>
            <Heart className="w-3 h-3 text-purple-400 fill-purple-400 animate-pulse" />
            <span className="text-slate-300">in Indonesia for Couple & Cozy Home Bedroom</span>
          </div>
        </div>
      </div>
    </footer>
  );
}