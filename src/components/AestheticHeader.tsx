import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AestheticHeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigateWorkspace?: (tabId: 'nfc' | 'memory' | 'graduation') => void;
}

export default function AestheticHeader({ cartCount, onCartClick, onNavigateWorkspace }: AestheticHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Koleksi', href: '#koleksi' },
    { name: 'Tentang Kami', href: '#tentang-kami' },
    { name: 'Manfaat', href: '#manfaat' },
    { name: 'Tujuan', href: '#tujuan' },
    { name: 'Keunggulan', href: '#keunggulan' },
    { name: 'Testimoni', href: '#testimoni' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 glass-beige border-b border-brand-beige-200/50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center z-50">
          <span className="font-serif text-2xl font-black tracking-widest bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            SANTARA
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-brand-brown-700 tracking-wider uppercase">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-purple-400 transition-colors">
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 z-50 text-brand-brown-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-20 left-0 w-full glass-beige bg-white/80 backdrop-blur-md border-b border-brand-beige-200/50 shadow-lg md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-2">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-brand-brown-700 hover:text-purple-500 font-medium py-3 px-4 rounded-lg hover:bg-brand-beige-100/50 transition-all duration-200 uppercase tracking-widest text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}