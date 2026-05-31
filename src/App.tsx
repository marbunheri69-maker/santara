import { useState } from 'react';
import { 
  Sparkles, Heart, Gift, Award, Compass, ArrowRight, Check, ShieldCheck, 
  Truck, Star, MessageSquare, ShoppingBag, Eye, HeartHandshake, Smile, RefreshCw, MessageCircle, 
  CarTaxiFrontIcon,
  Ambulance
} from 'lucide-react';
import { motion } from 'motion/react';


import { CartItem } from './types';
import AestheticHeader from './components/AestheticHeader';
import AestheticFooter from './components/AestheticFooter';
import CartDrawer from './components/CartDrawer';

// Import generated image paths
const HERO_IMG = '/images/hero.jpeg';
const NFC_LAMP_IMG = '/images/lampu1.jpeg';
const MEMORY_FRAME_IMG = '/images/bingkai1.jpeg';
const GRAD_PLAQUE_IMG = '/images/graduestion.jpeg';

// Tipe Data untuk TypeScript agar terhindar dari error data type
interface ProductDetail {
  title: string;
  price: string;
  badges: string[];
  images: string[];
  desc: string;
  longDesc: string;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Tambahkan 'null' ke dalam tipe data agar bisa menerima nilai kosong
const [activeWorkspace, setActiveWorkspace] = useState<'nfc' | 'memory' | 'graduation' | null>(null);
  const [activeButton, setActiveButton] = useState<'koleksi' | 'workshop' | null>(null);

  // Interactive notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ==========================================
  // STATE BARU UNTUK FITUR DETAIL POPUP & SLIDER
  // ==========================================
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // 3. State Tombol Selesai (Tambahkan ini di sini)
  const [isClicked, setIsClicked] = useState(false);

  // ==========================================
  // DATA DETAIL PRODUK DENGAN 2 FOTO (SLIDER)
  // ==========================================
  const productsData: Record<string, ProductDetail> = {
    nfc: {
      title: "NFC Sleep Ritual Crescent Lamp",
      price: "Rp 75.000",
      badges: ["Smart NFC", "Sleep Ritual", "Aesthetic"],
      // Sediakan path gambar kedua kamu atau gunakan placeholder sementara ini dulu
      images: [NFC_LAMP_IMG, "/images/lampu2.jpeg"], 
      desc: "Lampu akrilik berbentuk bulan dengan logo SANTARA. Cukup sentuhkan HP kustom Anda ke lampu untuk meredupkan pikiran, otomatis memutar playlist tidur, afirmasi hangat, white noise, dan jurnal pribadi.",
      longDesc: "Dibuat dengan akrilik premium berkualitas tinggi setebal 5mm dan dudukan kayu pinus pilihan. Dilengkapi dengan chip kustom NFC internal yang kompatibel dengan iOS dan Android untuk otomasi ritual malam Anda."
    },
    memory: {
      title: "Botanical Memory Polaroid Frame",
      price: "Rp 70.000",
      badges: ["Dried Flowers", "Polaroid Vibes", "Couple Gift"],
      images: [MEMORY_FRAME_IMG, "/images/bingkai2.jpeg"],
      desc: "Bingkai foto kustom kayu Oak/Walnut klasik dilengkapi hiasan rute kuntum bunga kering asli (pink sakura/lavender) hasil kurasi floris kami. Sempurna untuk mengabadikan anniversary atau merayakan jalinan persahabatan manis.",
      longDesc: "Menggunakan kaca anti-refleksi premium dan bunga edelweiss serta caspea asli yang diawetkan melalui proses pengeringan laboratorium sehingga warnanya tidak pudar bertahun-tahun."
    },
    graduation: {
      title: "Santara Luxury Graduation Acrylic",
      price: "Rp 80.000",
      badges: ["8mm Thick Acrylic", "Laser Engraved", "Graduation"],
      images: [GRAD_PLAQUE_IMG, "/images/graduestio1.jpeg"],
      desc: "Hadiah kustom kelulusan berbahan akrilik tebal yang dipotong presisi. Kustomisasi nama wisudawan, gelar akademis, lambang universitas, ucapan selamat, dan sematkan portrait terbaik wisudawan ke dalam plakat meja premium.",
      longDesc: "Dipotong menggunakan mesin Laser CO2 ultra-presisi tinggi menghasilkan tepian bevel crystal-clear yang mewah. Ketebalan akrilik 8mm solid memberikan kesan premium yang kokoh di meja."
    }
  };

  // Fungsi navigasi foto (Aman dari TypeScript Implicit 'any' error)
  const handlePrevImage = () => {
    setActiveImageIdx((prev: number) => (prev === 0 ? 1 : 0));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev: number) => (prev === 0 ? 1 : 0));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Cart Manipulation handlers
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    const customHash = JSON.stringify(newItem.customizationDetails);
    const uniqueId = `${newItem.productType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.productType === newItem.productType && JSON.stringify(item.customizationDetails) === customHash
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += newItem.quantity;
        showToast(`Meningkatkan kuantitas ${newItem.productName} di keranjang! 🌸`);
        return updated;
      } else {
        showToast(`Sukses menambahkan ${newItem.productName} ke keranjang! ✨`);
        return [...prevCart, { ...newItem, id: uniqueId }];
      }
    });

    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Produk dilepas dari keranjang.');
  };

  const handleUpdateCartItemQty = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleNavigateWorkspace = (tabId: 'nfc' | 'memory' | 'graduation') => {
    setActiveWorkspace(tabId);
    const element = document.getElementById('workshop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((accum, item) => accum + item.quantity, 0);

  return (
  <div className="min-h-screen flex flex-col bg-brand-beige-50 font-sans overflow-x-hidden selection:bg-brand-sunset-400 selection:text-brand-brown-950">
    
    {/* Toast Notification Container */}
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-50 px-4 w-full sm:w-auto pointer-events-auto">
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-brand-brown-900 border border-brand-sunset-400/30 text-white w-full max-w-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl flex items-start gap-3"
        >
          <div className="w-6 h-6 rounded-full bg-brand-sunset-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-brand-brown-900 stroke-[3]" />
          </div>

          <p className="text-xs sm:text-sm font-semibold tracking-wide leading-relaxed text-brand-beige-100 break-words">
            {toastMessage}
          </p>
        </motion.div>
      )}
    </div>

    {/* Primary Sticky Header */}
    <AestheticHeader
      cartCount={totalCartCount}
      onCartClick={() => setIsCartOpen(true)}
      onNavigateWorkspace={handleNavigateWorkspace}
    />

    {/* Slide-over Checkout Cart list */}
    <CartDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cart={cart}
      onRemove={handleRemoveCartItem}
      onUpdateQty={handleUpdateCartItemQty}
    />

    <main className="flex-1 w-full overflow-x-hidden">

     {/* HERO SECTION */}
<section className="relative overflow-hidden pt-12 pb-20 md:py-28 bg-gradient-to-b from-brand-cream to-brand-beige-50">
  
  {/* Decorative Glows */}
  <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-brand-sunset-400/10 rounded-full blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12">
      
      {/* BAGIAN KIRI (Teks Utama & Gambar Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
        
        {/* 1. JUDUL */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-brown-900 leading-[1.15]">
          Abadikan Momen, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-brown-700 via-brand-sunset-500 to-brand-rose-300 italic">
            Hadirkan Kenangan
          </span>
        </h1>

        {/* 2. GAMBAR (Hanya muncul di Mobile/Tablet) */}
        <div className="lg:hidden w-full max-w-sm">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-brand-beige-200 bg-brand-beige-100">
            <img src={HERO_IMG} alt="Santara Hero" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 3. DESKRIPSI (Muncul setelah Gambar di Mobile) */}
        <p className="text-sm sm:text-base text-brand-brown-700 max-w-xl leading-relaxed font-sans font-light">
          Produk dekorasi personal premium untuk menemani tidur, mengenang orang tersayang, dan merayakan pencapaian hidup. Didesain secara minimalis dan dikerjakan penuh cinta oleh tangan terampil lokal.
        </p>

        {/* Call-to-actions */}
<div className="w-full flex justify-center lg:justify-start pt-2">
  <a 
    href="#koleksi"
    onClick={() => setActiveButton('koleksi')}
    className={`px-8 py-4 font-sans font-semibold uppercase text-xs rounded-2xl flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-300
      ${activeButton === 'koleksi' 
        ? 'bg-sky-400 text-slate-950 font-bold' // Warna saat dipilih (Biru Muda)
        : 'bg-slate-900 text-white hover:bg-sky-400 hover:text-slate-950 hover:font-bold' // Warna default (Biru Tua) dan saat hover (Biru Muda)
      }`}
  >
    Lihat Koleksi 
    <ArrowRight 
      className={`w-4 h-4 transition-colors duration-300 ${
        activeButton === 'koleksi' ? 'text-slate-950' : 'text-sky-400 group-hover:text-slate-950'
      }`} 
    />
  </a>
</div>

        {/* Quick Trust badges */}
        <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4 border-t border-brand-beige-200/70 text-xs text-brand-brown-700">
          <div className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-brand-sunset-500" /> Premium Quality</div>
          <div className="flex items-center gap-1.5 font-medium"><HeartHandshake className="w-4 h-4 text-brand-sunset-500" /> 100% Handcrafted</div>
          <div className="flex items-center gap-1.5 font-medium"><Ambulance className="w-4 h-4 text-brand-sunset-500" /> Safe Nationwide</div>
        </div>
      </div>

      {/* BAGIAN KANAN (Hanya muncul di Desktop) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-brand-beige-200 bg-brand-beige-100">
          <img
            src={HERO_IMG}
            alt="Santara Cozy Bedroom Mockup"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>
      </div>

    </div>
  </div>
</section>


{/* MAIN PRODUCT COLECTION SECTION */}
<section
  id="koleksi"
  className="py-16 sm:py-20 bg-brand-beige-100/10 border-t border-brand-beige-200/30 overflow-x-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Section description */}
    <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
      <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-brand-sunset-500">
        Premium Catalog
      </span>

      <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-brown-950 tracking-tight leading-tight break-words">
        Tiga Mahakarya Santara
      </h2>

      <div className="w-16 h-1 bg-brand-sunset-400 mx-auto rounded-full" />

      <p className="text-sm sm:text-base text-brand-brown-600 font-light max-w-2xl mx-auto leading-relaxed mt-2 px-1 sm:px-0">
        Hadirkan keseimbangan estetik dan nilai emosional di kamar tidur ataupun berikan hadiah kustom terbaik yang membekas mendalam di hati penerima.
      </p>
    </div>

    {/* Three Product Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      
      {/* Product 1: NFC Sleep Ritual */}
      <div
        onClick={() => {
          setSelectedProduct(productsData.nfc);
          setActiveImageIdx(0);
        }}
        className="flex flex-col bg-brand-beige-50 rounded-3xl border border-brand-beige-200/70 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer h-full"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-brand-cream relative">
          <img
            src={NFC_LAMP_IMG}
            alt="NFC Sleep Ritual Lamp"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-sky-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Terlaris
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 leading-snug break-words">
            NFC Sleep Ritual Crescent Lamp
          </h3>

          <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light line-clamp-3">
            Lampu akrilik berbentuk bulan dengan logo SANTARA. Cukup sentuhkan HP kustom Anda ke lampu untuk meredupkan pikiran, otomatis memutar playlist tidur, afirmasi hangat, white noise, dan jurnal pribadi.
          </p>

          <div
            className="pt-4 border-t border-brand-beige-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-serif text-base sm:text-lg font-bold text-brand-brown-900">
              Rp 75.000
            </span>

            <button
              onClick={() => {
                setSelectedProduct(productsData.nfc);
                setActiveImageIdx(0);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      {/* Product 2: Memory Frame */}
      <div
        onClick={() => {
          setSelectedProduct(productsData.memory);
          setActiveImageIdx(0);
        }}
        className="flex flex-col bg-brand-beige-50 rounded-3xl border border-brand-beige-200/70 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer h-full"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-brand-cream relative">
          <img
            src={MEMORY_FRAME_IMG}
            alt="Memory Frame with Dried Flowers"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-brand-rose-300 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
            Handmade
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 leading-snug break-words">
            Botanical Memory Polaroid Frame
          </h3>

          <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light line-clamp-3">
            Bingkai foto kustom kayu Oak/Walnut klasik dilengkapi hiasan rute kuntum bunga kering asli. Sempurna untuk mengabadikan anniversary atau merayakan jalinan persahabatan manis.
          </p>

          <div
            className="pt-4 border-t border-brand-beige-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-serif text-base sm:text-lg font-bold text-brand-brown-900">
              Rp 70.000
            </span>

            <button
              onClick={() => {
                setSelectedProduct(productsData.memory);
                setActiveImageIdx(0);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      {/* Product 3: Acrylic Graduation Frame */}
      <div
        onClick={() => {
          setSelectedProduct(productsData.graduation);
          setActiveImageIdx(0);
        }}
        className="flex flex-col bg-brand-beige-50 rounded-3xl border border-brand-beige-200/70 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer h-full"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-brand-cream relative">
          <img
            src={GRAD_PLAQUE_IMG}
            alt="Acrylic Graduation Plaque"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-brand-sunset-500 text-brand-brown-950 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
            Luxury Art
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 leading-snug break-words">
            Santara Luxury Graduation Acrylic
          </h3>

          <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light line-clamp-3">
            Hadiah kustom kelulusan berbahan akrilik tebal yang dipotong presisi. Kustomisasi nama wisudawan, gelar akademis, lambang universitas, ucapan selamat, dan sematkan portrait terbaik wisudawan ke dalam plakat meja premium.
          </p>

          <div
            className="pt-4 border-t border-brand-beige-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-serif text-base sm:text-lg font-bold text-brand-brown-900">
              Rp 80.000
            </span>

            <button
              onClick={() => {
                setSelectedProduct(productsData.graduation);
                setActiveImageIdx(0);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

    {/* MODAL DETAIL PRODUK + SLIDER 2 FOTO */}
{selectedProduct && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    onClick={() => setSelectedProduct(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-brand-beige-50 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-brand-beige-200 max-h-[95vh] flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200"
    >
      
      {/* Tombol Close Modal */}
      <button
        onClick={() => setSelectedProduct(null)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-400 text-white hover:bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer text-sm shadow-md"
      >
        ✕
      </button>

      {/* Bagian Kiri: Slider 2 Foto */}
      <div className="md:w-1/2 bg-brand-cream relative aspect-[4/3] sm:aspect-[5/4] md:aspect-auto md:min-h-[420px] shrink-0">
        
        <img
          src={selectedProduct.images[activeImageIdx]}
          alt={selectedProduct.title}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Tombol Panah Kiri */}
        <button
          onClick={() =>
            setActiveImageIdx((prev) => (prev === 0 ? 1 : 0))
          }
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer text-xs transition-colors backdrop-blur-sm"
        >
          ❮
        </button>

        {/* Tombol Panah Kanan */}
        <button
          onClick={() =>
            setActiveImageIdx((prev) => (prev === 0 ? 1 : 0))
          }
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer text-xs transition-colors backdrop-blur-sm"
        >
          ❯
        </button>

        {/* Kontrol Navigasi Bulatan */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
          {selectedProduct.images.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIdx(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeImageIdx === idx
                  ? 'bg-brand-sunset-400 w-5'
                  : 'bg-white/60 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bagian Kanan: Informasi & Deskripsi */}
      <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
        
        <div className="space-y-4">
          
          <div className="flex flex-wrap gap-1.5">
            {selectedProduct.badges.map((badge: string, i: number) => (
              <span
                key={i}
                className="text-[9px] sm:text-[10px] font-bold uppercase bg-brand-sunset-100 text-brand-sunset-500 px-2 py-1 rounded-md break-words"
              >
                {badge}
              </span>
            ))}
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-brown-900 leading-snug break-words">
            {selectedProduct.title}
          </h3>

          <span className="font-serif text-base sm:text-lg font-bold text-brand-sunset-500 block">
            {selectedProduct.price}
          </span>

          <div className="w-12 h-0.5 bg-brand-beige-300" />

          <p className="text-xs sm:text-sm text-brand-brown-700 font-light leading-relaxed break-words">
            {selectedProduct.desc}
          </p>

          <p className="text-xs sm:text-sm text-brand-brown-600 font-light leading-relaxed bg-brand-beige-200/30 p-3 rounded-xl border border-brand-beige-200/50 break-words">
            {selectedProduct.longDesc}
          </p>
        </div>

        {/* Tombol WhatsApp */}
        <div className="pt-5 sm:pt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();

              const phoneNumber = "6281991618323";

              const imageUrl =
                (selectedProduct.images &&
                  selectedProduct.images[0]) ||
                "";

              const message = `Halo Santara, saya ingin memesan produk berikut:
      
*Nama Produk:* ${selectedProduct.title}
*Harga:* ${selectedProduct.price}

*Link Foto Produk:* ${imageUrl}

Mohon informasi lebih lanjut mengenai cara pemesanannya. Terima kasih!`;

              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
              )}`;

              window.open(whatsappUrl, "_blank");
              setSelectedProduct(null);
            }}
            className="w-full py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] sm:text-xs font-bold uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.005 0C5.37 0 .002 5.368.002 12.006c0 2.092.548 4.136 1.594 5.947L0 24l6.33-1.661a11.75 11.75 0 005.674 1.444h.006c6.635 0 12.003-5.369 12.003-12.005 0-3.211-1.25-6.233-3.522-8.504z" />
            </svg>

            <span className="truncate">
              Order via WhatsApp
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        {/* TENTANG KAMI SECTION */}
        <section id="tentang-kami" className="py-24 bg-brand-cream/30 border-t border-brand-beige-200/40 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-sunset-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-widest uppercase text-brand-sunset-500 block">Kisah & Filosofi</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-brown-950 leading-tight">
                  Santara: Menghubungkan Rasa, Keindahan, dan Ketenangan
                </h2>
                <div className="w-16 h-1 bg-brand-sunset-400 rounded-full" />
                
                <p className="text-sm text-brand-brown-700 leading-relaxed font-light">
                  Santara lahir dari sebuah perenungan mendalam tentang bagaimana manusia modern kehilangan kedamaian di akhir harinya. Di tengah kepungan layar digital dan bisingnya dunia, kami percaya bahwa setiap individu layak mendapatkan momen sakral sebelum mengistirahatkan jiwa dan raganya.
                </p>
                
                <p className="text-sm text-brand-brown-700 leading-relaxed font-light">
                  Kami memadukan keindahan material organik buatan alam—kayu Oak kokoh dan bunga alami yang diawetkan—dengan teknologi nirkabel kustom modern (NFC). Dengan satu sentuhan lembut gawai Anda ke produk kami, ketenangan lahiriah dan batiniah langsung tercipta, mengantarkan Anda menuju alam mimpi yang berkualitas.
                </p>
                
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <span className="w-9 h-9 rounded-full bg-brand-sunset-400 text-brand-brown-950 font-bold border-2 border-brand-beige-100 text-xs flex items-center justify-center">S</span>
                    <span className="w-9 h-9 rounded-full bg-brand-brown-800 text-white font-bold border-2 border-brand-beige-100 text-xs flex items-center justify-center">A</span>
                    <span className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold border-2 border-brand-beige-100 text-xs flex items-center justify-center">N</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-brown-800 block">Dibuat Dengan Penuh Rasa</span>
                    <span className="text-[10px] text-brand-brown-600">Oleh Tim Pengrajin Lokal Terbaik Indonesia</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid layout style key points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-brand-beige-100/40 p-6 rounded-3xl border border-brand-beige-200/50 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-brand-brown-800">100% Organik</h4>
                  <p className="text-xs text-brand-brown-600 font-light leading-relaxed">
                    Setiap kelopak bunga dikeringkan secara manual dengan teknik presisi tinggi demi menjaga warna alami tetap cerah selamanya.
                  </p>
                </div>

                <div className="bg-brand-beige-100/40 p-6 rounded-3xl border border-brand-beige-200/50 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-brand-brown-800">Cahaya Ambient Healing</h4>
                  <p className="text-xs text-brand-brown-600 font-light leading-relaxed">
                    Menghasilkan pendar cahaya temaram yang hangat dan lembut di mata, didesain khusus merangsang hormon melatonin.
                  </p>
                </div>

                <div className="bg-brand-beige-100/40 p-6 rounded-3xl border border-brand-beige-200/50 sm:col-span-2 space-y-3 relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                    <Sparkles className="w-32 h-32 text-brand-brown-800" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center">
                    <Smile className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-brand-brown-800">Kustomisasi Emosional</h4>
                  <p className="text-xs text-brand-brown-600 font-light leading-relaxed">
                    Lebih dari sekadar pajangan kayu, ini adalah media untuk mencurahkan ucapan kelulusan, perayaan cinta, ataupun memori yang terus menyala hangat.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* MANFAAT SECTION */}
<section
  id="manfaat"
  className="py-16 sm:py-24 bg-brand-beige-50 border-t border-brand-beige-200/30 overflow-x-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
      
      <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-brand-sunset-500">
        The Power of Mindfulness
      </span>

      <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-brand-brown-950 leading-tight break-words">
        Manfaat Menghadirkan Santara
      </h2>

      <div className="w-12 h-1 bg-brand-sunset-400 mx-auto rounded-full" />

      <p className="text-sm sm:text-base text-brand-brown-600 font-light max-w-sm sm:max-w-xl mx-auto mt-2 block leading-relaxed px-1 sm:px-0">
        Temukan keajaiban sentuhan emosional dan ketenangan batin yang akan mengubah cara Anda mengistirahatkan hari tidur Anda.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      
      {/* Manfaat 1 */}
      <div className="bg-brand-orange-50/10 hover:bg-brand-cream/40 p-6 sm:p-8 rounded-3xl border border-brand-beige-200/50 transition-all duration-300 relative group overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-brand-sunset-400/5 rounded-bl-full pointer-events-none" />

        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center font-bold text-base sm:text-lg mb-5 sm:mb-6 shadow-sm shrink-0">
          01
        </div>

        <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 mb-3 group-hover:text-brand-sunset-500 transition-colors leading-snug break-words">
          Tidur Lebih Berkualitas & Tenang
        </h3>

        <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
          Lupakan kebiasaan bermain HP sebelum tidur. Cukup dekatkan ponsel Anda ke modul NFC, dengarkan alunan musik tenang pengantar tidur, redupkan pikiran Anda, dan rasakan transisi tidur yang pulas dalam waktu singkat.
        </p>
      </div>

      {/* Manfaat 2 */}
      <div className="bg-brand-orange-50/10 hover:bg-brand-cream/40 p-6 sm:p-8 rounded-3xl border border-brand-beige-200/50 transition-all duration-300 relative group overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-brand-rose-200/10 rounded-bl-full pointer-events-none" />

        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center font-bold text-base sm:text-lg mb-5 sm:mb-6 shadow-sm shrink-0">
          02
        </div>

        <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 mb-3 group-hover:text-brand-sunset-500 transition-colors leading-snug break-words">
          Aesthetic Sanctuary Menawan
        </h3>

        <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
          Meningkatkan derajat estetika kamar Anda ke level butik mewah. Kombinasi eksklusif lampu tidur bulan sabit, bunga edelweiss kering pilihan, serta akrilik tebal yang mengkilap menghasilkan harmoni visual yang memanjakan mata.
        </p>
      </div>

      {/* Manfaat 3 */}
      <div className="bg-brand-orange-50/10 hover:bg-brand-cream/40 p-6 sm:p-8 rounded-3xl border border-brand-beige-200/50 transition-all duration-300 relative group overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-brand-sunset-400/5 rounded-bl-full pointer-events-none" />

        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center font-bold text-base sm:text-lg mb-5 sm:mb-6 shadow-sm shrink-0">
          03
        </div>

        <h3 className="font-serif text-base sm:text-lg font-bold text-brand-brown-800 mb-3 group-hover:text-brand-sunset-500 transition-colors leading-snug break-words">
          Koneksi Emosional Mengalir Hangat
        </h3>

        <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
          Mampu melahirkan rasa gembira, haru, dan dihargai bagi siapapun yang menerimanya. Baik sebagai hadiah wisuda kustom berpita satin, plakat akrilik, maupun frame polaroid pre-wedding romantis yang mengabadikan memori manis persahabatan dan cinta Anda.
        </p>
      </div>

    </div>

  </div>
</section>

{/* TUJUAN SECTION */}
<section
  id="tujuan"
  className="py-16 sm:py-24 bg-brand-beige-100/40 border-t border-brand-beige-200/40 relative overflow-x-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Kotak Utama */}
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Glowing nebula */}
      <div className="absolute -top-12 -right-12 w-48 sm:w-80 h-48 sm:h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 sm:w-80 h-48 sm:h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        
        {/* Judul Utama */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4 text-center xl:text-left">
          
          <span className="text-sky-400 text-[11px] sm:text-xs font-mono uppercase tracking-widest block font-bold">
            Core Purpose
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight break-words">
            Tujuan Agung Kami
          </h2>

          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-amber-500 rounded-full mx-auto xl:mx-0" />

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light max-w-xl mx-auto xl:mx-0 break-words">
            Santara hadir menjembatani ketenangan batin dan keabadian memori, menciptakan ruang istirahat yang sakral sekaligus menjaga momen berharga Anda tetap hidup di era digital.
          </p>
        </div>

        {/* 3 Poin */}
        <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Poin 1 */}
          <div className="bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl space-y-3 hover:bg-white/[0.06] transition-colors duration-300 h-full overflow-hidden">
            
            <span className="text-sky-400 text-2xl sm:text-3xl font-serif font-black block">
              01
            </span>

            <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-snug break-words">
              Istirahat Lebih Bermutu
            </h4>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed break-words">
              Membantu Anda melepaskan diri dari distraksi digital malam hari, menciptakan transisi tidur yang rileks demi kualitas *deep sleep* yang maksimal.
            </p>
          </div>

          {/* Poin 2 */}
          <div className="bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl space-y-3 hover:bg-white/[0.06] transition-colors duration-300 h-full overflow-hidden">
            
            <span className="text-sky-400 text-2xl sm:text-3xl font-serif font-black block">
              02
            </span>

            <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-snug break-words">
              Keabadian Memori
            </h4>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed break-words">
              Menyimpan ucapan emosional, galeri foto kelulusan, hingga kenangan indah bersama orang terkasih agar tidak hilang tertimbun waktu.
            </p>
          </div>

          {/* Poin 3 */}
          <div className="bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl space-y-3 hover:bg-white/[0.06] transition-colors duration-300 h-full overflow-hidden">
            
            <span className="text-sky-400 text-2xl sm:text-3xl font-serif font-black block">
              03
            </span>

            <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-snug break-words">
              Satu Ketukan Magis
            </h4>

            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed break-words">
              Menyatukan automasi fitur pintar dan memori personal secara instan lewat teknologi sensor NFC, tanpa perlu konfigurasi aplikasi yang rumit.
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
</section>

    {/* INTERACTIVE WORKSHOP DESIGNER SECTION */}
<section
  id="workshop"
  className="py-16 sm:py-20 bg-brand-beige-100/40 border-t border-b border-brand-beige-200/50 overflow-x-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header section control */}
    <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-10">
      
      <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-brand-sunset-500">
        Quick Guide Hub
      </span>

      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-brown-800 leading-tight break-words">
        Panduan Penggunaan Produk Santara
      </h2>

      <div className="w-12 h-1 bg-brand-sunset-400 mx-auto rounded-full mt-2" />

      <p className="text-sm sm:text-base text-brand-brown-600 max-w-md mx-auto leading-relaxed px-1 sm:px-0">
        Pilih salah satu produk di bawah ini untuk melihat panduan visual dan langkah aktivasi fitur pintarnya.
      </p>
    </div>

    {/* BARIS TOMBOL */}
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl mx-auto mb-4">
      {[
        { id: 'nfc', label: '🌙 NFC Lunar Lamp' },
        { id: 'memory', label: '🌸 Memory Frame' },
        { id: 'graduation', label: '🎓 Graduation Plaque' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveWorkspace(tab.id as any);
          }}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-950 rounded-2xl text-[11px] sm:text-xs font-bold font-sans tracking-wide uppercase shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* POPUP MODAL */}
    {activeWorkspace && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={() => setActiveWorkspace(null as any)}
        />

        {/* Konten Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-brand-beige-200 relative z-10 flex flex-col md:flex-row"
        >
          
          {/* Tombol Close */}
          <button
            onClick={() => setActiveWorkspace(null as any)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-400 text-white hover:bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer text-sm shadow-md"
          >
            ✕
          </button>

          {/* SISI KIRI */}
          <div className="w-full md:w-5/12 bg-brand-beige-100/50 aspect-square md:aspect-auto md:min-h-[450px] relative overflow-hidden flex items-center justify-center shrink-0">
            
            <img
              src={
                activeWorkspace === 'nfc'
                  ? NFC_LAMP_IMG
                  : activeWorkspace === 'memory'
                  ? MEMORY_FRAME_IMG
                  : GRAD_PLAQUE_IMG
              }
              alt="Pratinjau Produk"
              className="w-full h-full object-cover animate-fade-in"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950/70 to-transparent text-white pt-12 hidden md:block">
              
              <span className="text-[10px] uppercase tracking-widest font-bold text-sky-400">
                Santara Premium
              </span>

              <h3 className="font-serif text-base sm:text-lg font-bold break-words">
                {activeWorkspace === 'nfc' && 'NFC Lunar Lamp'}
                {activeWorkspace === 'memory' && 'Botanical Memory Frame'}
                {activeWorkspace === 'graduation' && 'Graduation Plaque'}
              </h3>
            </div>
          </div>

          {/* SISI KANAN */}
          <div className="w-full md:w-7/12 p-5 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
            
            <div>
              
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-sunset-500">
                Quick Step Activation
              </span>

              <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-5 sm:mb-6 leading-tight break-words">
                {activeWorkspace === 'nfc' &&
                  'Cara Pakai Lampu Tidur Pintar'}
                {activeWorkspace === 'memory' &&
                  'Cara Aktivasi Bingkai Memori'}
                {activeWorkspace === 'graduation' &&
                  'Cara Pemasangan Plakat Wisuda'}
              </h3>

              {/* LIST LANGKAH */}
              <div className="space-y-5">
                
                {activeWorkspace === 'nfc' && (
                  <>
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        1
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Dekatkan Smartphone
                        </strong>

                        Aktifkan fitur NFC di HP Anda, kemudian tempelkan bagian belakang badan smartphone pada logo kayu kustom di tatakan Lampu Santara.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        2
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Automasi Sleep Ritual
                        </strong>

                        Secara otomatis sistem meredupkan pencahayaan layar HP, menyalakan mode hening, serta memutar playlist ketenangan tidur pilihan.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        3
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Tidur Nyenyak Maksimal
                        </strong>

                        Istirahatlah dengan damai tanpa gangguan kilatan notifikasi digital, lalu bangun esok pagi dengan kondisi pikiran yang bugar.
                      </p>
                    </div>
                  </>
                )}

                {/* MEMORY */}
                {activeWorkspace === 'memory' && (
                  <>
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        1
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Pajang di Area Favorit
                        </strong>

                        Pajang Botanical Memory Frame premium ini di meja nakas ranjang tidur atau area dinding kamar yang strategis dan estetik.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        2
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Scan QR / NFC Kenangan
                        </strong>

                        Scan kode QR eksklusif atau tap titik sensornya untuk memunculkan situs mikro galeri digital berisi lembaran momen manis berharga Anda.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        3
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Perawatan Bunga Awet
                        </strong>

                        Bunga kering alami dirangkai presisi tanpa perlu disiram air selamanya, pastikan terhindar dari kelembapan tinggi ruangan.
                      </p>
                    </div>
                  </>
                )}

                {/* GRADUATION */}
                {activeWorkspace === 'graduation' && (
                  <>
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        1
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Lepas Film Proteksi
                        </strong>

                        Kupas plastik lembaran pelindung buram tipis pada kedua sisi permukaan akrilik untuk menampilkan kilau bening kaca yang jernih.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        2
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Pasang ke Slot Dudukan
                        </strong>

                        Sematkan lembaran akrilik grafir kustom wisuda tersebut secara tegak lurus pada balok kayu jati dudukan premium bawaan paket.
                      </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-900 text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                        3
                      </div>

                      <p className="text-xs sm:text-sm text-brand-brown-600 leading-relaxed font-light break-words">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Monumen Kebanggaan
                        </strong>

                        Pajang dengan bangga di bufet ruang keluarga atau meja belajar utama Anda sebagai simbol abadi jerih payah kesuksesan akademik monumental Anda.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <div className="pt-4 border-t border-brand-beige-200 flex justify-center sm:justify-end">
              <button
                onClick={() => {
                  setIsClicked(true);

                  setTimeout(() => {
                    setActiveWorkspace(null as any);
                    setIsClicked(false);
                  }, 300);
                }}
                className={`w-full sm:w-auto px-5 py-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-md ${
                  isClicked
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-400 hover:bg-blue-500 text-white'
                }`}
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </div>
</section>

      {/* BRAND VALUES / ADVANTAGES SECTION */}
<section
  id="keunggulan"
  className="py-16 sm:py-20 bg-brand-beige-100/10 border-b border-brand-beige-200/30 overflow-x-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
      
      <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-brand-sunset-500">
        Our Promises
      </span>

      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-brown-950 leading-tight break-words px-2 sm:px-0">
        Keunggulan Signature Santara
      </h2>

      <div className="w-12 h-1 bg-brand-sunset-400 mx-auto rounded-full mt-2" />
    </div>

    {/* Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
      
      {/* Card 1 */}
      <div className="bg-brand-cream/50 p-5 sm:p-6 rounded-2xl border border-brand-beige-200 text-center space-y-3 shadow-xs flex flex-col items-center hover:shadow-md transition-all duration-300 h-full">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center animate-float shrink-0">
          <Compass className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-brand-brown-800 break-words">
          Custom Design
        </h4>

        <p className="text-xs sm:text-[13px] text-brand-brown-600 leading-relaxed font-light break-words">
          Rancang bebas nama, tata ucapan hangat, variasi kayu, floral kustom, dan foto wisudamu sesuka hati.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-brand-cream/50 p-5 sm:p-6 rounded-2xl border border-brand-beige-200 text-center space-y-3 shadow-xs flex flex-col items-center hover:shadow-md transition-all duration-300 h-full">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center animate-float shrink-0">
          <Award className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-brand-brown-800 break-words">
          Premium Material
        </h4>

        <p className="text-xs sm:text-[13px] text-brand-brown-600 leading-relaxed font-light break-words">
          Menggunakan kayu Oak impor kokoh, akrilik tebal (8mm) anti pecah, dan ketajaman cetak tinggi.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-brand-cream/50 p-5 sm:p-6 rounded-2xl border border-brand-beige-200 text-center space-y-3 shadow-xs flex flex-col items-center hover:shadow-md transition-all duration-300 h-full">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center animate-float shrink-0">
          <Heart className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-brand-brown-800 break-words">
          Handmade with Love
        </h4>

        <p className="text-xs sm:text-[13px] text-brand-brown-600 leading-relaxed font-light break-words">
          Setiap plakat dan frame dipacking & dihias kuntum bunga alami yang dikeringkan secara saksama.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-brand-cream/50 p-5 sm:p-6 rounded-2xl border border-brand-beige-200 text-center space-y-3 shadow-xs flex flex-col items-center hover:shadow-md transition-all duration-300 h-full">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center animate-float shrink-0">
          <Smile className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-brand-brown-800 break-words">
          Fast Response
        </h4>

        <p className="text-xs sm:text-[13px] text-brand-brown-600 leading-relaxed font-light break-words">
          Tim desainer dan admin kami sigap menemani dan membimbing Anda dari desain hingga pengiriman.
        </p>
      </div>

      {/* Card 5 */}
      <div className="bg-brand-cream/50 p-5 sm:p-6 rounded-2xl border border-brand-beige-200 text-center space-y-3 shadow-xs flex flex-col items-center hover:shadow-md transition-all duration-300 h-full">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-brown-800 text-brand-sunset-400 flex items-center justify-center animate-float shrink-0">
          <Gift className="w-5 h-5" />
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-brand-brown-800 break-words">
          Cocok untuk Gift
        </h4>

        <p className="text-xs sm:text-[13px] text-brand-brown-600 leading-relaxed font-light break-words">
          Sudah dipasangi box eksklusif berpita satin, tas jinjing premium, dan kartu ucapan kustom gratis.
        </p>
      </div>

    </div>
  </div>
</section>


        {/* REVIEWS / TESTIMONIALS SECTION */}
<section
  id="testimoni"
  className="py-16 sm:py-20 lg:py-24 bg-brand-beige-100/40 relative overflow-hidden"
>
  
  {/* Decorative Background Elements */}
  <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-sky-200/20 blur-[90px] sm:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
  
  <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-brand-sunset-400/10 blur-[90px] sm:blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    {/* Header */}
    <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 sm:mb-16">
      
      <span className="inline-flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] sm:tracking-[0.25em] uppercase text-sky-400 bg-sky-500/10 border border-sky-400/20 px-3 sm:px-4 py-1.5 rounded-full animate-pulse break-words">
        ✨ Kisah Sukses Pelanggan
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight py-1 break-words">
        <span className="text-white block">
          Apa Kata Mereka?
        </span>
      </h2>

      <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-sky-400 via-brand-sunset-400 to-amber-400 mx-auto rounded-full shadow-xs" />

      <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed font-normal px-1 sm:px-0">
        Bergabunglah bersama{' '}
        <span className="font-bold text-white underline decoration-sky-400 decoration-2">
          ribuan pelanggan
        </span>{' '}
        yang telah berhasil meningkatkan kualitas istirahat malam dan mengabadikan momen magis terbaiknya.
      </p>
    </div>

    {/* Grid Testimoni */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
      
      {/* Card 1 */}
      <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-[1.75rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)] hover:border-sky-300 transition-all duration-500 flex flex-col justify-between relative overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-sky-400/5 rounded-full -mr-8 -mt-8 group-hover:bg-sky-400/10 transition-colors" />

        <div className="space-y-4 relative z-10">
          
          <div className="flex items-center gap-1 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0"
              />
            ))}
          </div>

          <p className="text-sm sm:text-[15px] italic text-slate-800 font-normal leading-relaxed break-words">
            “Barangnya aesthetic banget! Lampu NFC-nya bener-bener ngebantu aku ritual tidur tiap malam. Tempel HP langsung dengerin lofi & baca afirmasi kustom aku sendiri. Kamar jadi cozy kaya spa mewah!”
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-gray-100 relative z-10">
          
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-sky-200 shrink-0">
            R
          </div>

          <div className="min-w-0">
            <h5 className="text-sm font-bold text-slate-900 break-words">
              Raras Amanda
            </h5>

            <p className="text-xs text-sky-600 font-semibold mt-0.5 break-words">
              NFC Sleep Ritual Buyer
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-[1.75rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(251,191,36,0.12)] hover:border-brand-sunset-300 transition-all duration-500 flex flex-col justify-between relative overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-brand-sunset-400/5 rounded-full -mr-8 -mt-8 group-hover:bg-brand-sunset-400/10 transition-colors" />

        <div className="space-y-4 relative z-10">
          
          <div className="flex items-center gap-1 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0"
              />
            ))}
          </div>

          <p className="text-sm sm:text-[15px] italic text-slate-800 font-normal leading-relaxed break-words">
            “Pacar aku suka banget hadiah ini. Bunga pink-nya kering alami dan tertata rapi banget di ujung frame kayu Oak-nya. Polaroid prewed kami juga dicetak jernih. Cocok buat pajangan meja kerja dia.”
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-gray-100 relative z-10">
          
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-sunset-400 to-orange-500 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-orange-200 shrink-0">
            F
          </div>

          <div className="min-w-0">
            <h5 className="text-sm font-bold text-slate-900 break-words">
              Fikri Syihab
            </h5>

            <p className="text-xs text-brand-sunset-600 font-semibold mt-0.5 break-words">
              Memory Polaroid Buyer
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-[1.75rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:border-emerald-300 transition-all duration-500 flex flex-col justify-between relative overflow-hidden h-full">
        
        <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-emerald-400/5 rounded-full -mr-8 -mt-8 group-hover:bg-emerald-400/10 transition-colors" />

        <div className="space-y-4 relative z-10">
          
          <div className="flex items-center gap-1 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0"
              />
            ))}
          </div>

          <p className="text-sm sm:text-[15px] italic text-slate-800 font-normal leading-relaxed break-words">
            “Bikin kamar jadi lebih hidup. Plakat akrilik wisudanya sangat mewah dengan base kayu gelap yang kokoh. Adminnya juga luar biasa sabar ngatur tulisan panjang aku biar keliatan pas di akrilik.”
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-gray-100 relative z-10">
          
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-emerald-200 shrink-0">
            M
          </div>

          <div className="min-w-0">
            <h5 className="text-sm font-bold text-slate-900 break-words">
              Mutia Farah
            </h5>

            <p className="text-xs text-emerald-600 font-semibold mt-0.5 break-words">
              Graduation Plaque Buyer
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


        {/* FINAL HERO CTA SECTION */}
<section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-slate-950 text-white text-center">
  
  {/* Decorative Backlights */}
  <div className="absolute top-0 right-0 w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 bg-sky-500/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 bg-brand-sunset-500/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
    
    <span className="text-sky-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.3em] block">
      Santara Boutique Atelier
    </span>
    
    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight px-1">
      “Setiap Kenangan Layak Diabadikan”
    </h2>
    
    <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed px-2 sm:px-0">
      Manjakan diri Anda ataupun berikan hadiah terindah untuk orang yang paling berharga bagi Anda. Tim kreatif kami siap melayani pesanan kustomisasi Anda sepenuh hati melalui konsultasi personal.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
      
      {/* Tombol Utama: Order via WhatsApp */}
      <a
        href="https://wa.me/6281991618323?text=Halo%20Santara!%20Saya%20ingin%20memesan%20produk%20kustom%20Santara."
        target="_blank"
        rel="noreferrer"
        className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        {/* Ikon WhatsApp SVG */}
        <svg 
          className="w-4 h-4 fill-current shrink-0" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.005 0C5.37 0 .002 5.368.002 12.004c0 2.093.547 4.14 1.589 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.645 1.437h.005c6.635 0 12.003-5.368 12.003-12.004 0-3.216-1.25-6.241-3.522-8.513"/>
        </svg>

        <span className="whitespace-nowrap">
          Order Sekarang
        </span>
      </a>
    </div>

    {/* Quality badge checklist */}
    <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-x-6 text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-[0.15em] sm:tracking-widest text-center">
      <span>✓ Gratis Pita Satin & Gift Box</span>

      <span className="hidden sm:inline">•</span>

      <span>✓ Garansi Akrilik Pecah Ganti Baru</span>

      <span className="hidden sm:inline">•</span>

      <span>✓ Quality Check Berlapis</span>
    </div>

  </div>
</section>

{/* FOOTER */}
<AestheticFooter onNavigateWorkspace={handleNavigateWorkspace} />

</main>

</div>
);
}


// Simple internal icon helper for beautiful review designs
function QuoteIcon() {
return (
  <svg className="w-6 sm:w-8 h-6 sm:h-8 opacity-15 fill-current" viewBox="0 0 24 24">
    <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3z" />
  </svg>
);
}