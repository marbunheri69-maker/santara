import { ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface AestheticHeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigateWorkspace?: (tabId: 'nfc' | 'memory' | 'graduation') => void;
}

export default function AestheticHeader({ cartCount, onCartClick, onNavigateWorkspace }: AestheticHeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 z-40 glass-beige border-b border-brand-beige-200/50 shadow-xs transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Bersih Tanpa Titik */}
        <a href="#" className="flex items-center group">
          <span className="font-serif text-2xl font-black tracking-widest bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
            SANTARA
          </span>
        </a>

        {/* Navigation links - hidden on mobile, visible on desktop */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-brand-brown-700 tracking-wider uppercase">
          <a href="#koleksi" className="hover:text-purple-400 transition-colors">Koleksi</a>
          <a href="#tentang-kami" className="hover:text-purple-400 transition-colors">Tentang Kami</a>
          <a href="#manfaat" className="hover:text-purple-400 transition-colors">Manfaat</a>
          <a href="#tujuan" className="hover:text-purple-400 transition-colors">Tujuan</a>
          <a href="#keunggulan" className="hover:text-purple-400 transition-colors">Keunggulan</a>
          <a href="#testimoni" className="hover:text-purple-400 transition-colors">Testimoni</a>
        </nav>

        {/* Utilities Bagian Kanan - Kosong & Simetris */}
        <div className="flex items-center gap-4 md:w-[134px] justify-end" />

      </div>
    </header>
  );
}