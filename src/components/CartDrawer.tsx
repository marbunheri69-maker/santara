import { X, Trash2, Plus, Minus, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemove,
  onUpdateQty,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.basePrice * item.quantity, 0);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let message = `Halo SANTARA! 🌸\n\nSaya ingin memesan produk kustom berikut:\n`;

    cart.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.productName}* x${item.quantity}\n`;
      message += `   Harga: ${formatRupiah(item.basePrice)}\n`;

      if (item.productType === 'nfc' && item.customizationDetails.nfc) {
        const nfc = item.customizationDetails.nfc;
        message += `   • Playlist: ${nfc.playlistName}\n`;
        message += `   • Afirmasi: "${nfc.nightAffirmation || 'Default Santara Affirmation'}"\n`;
        message += `   • White Noise: Suara ${nfc.whiteNoise.toUpperCase()}\n`;
        message += `   • Fitur Jurnal: ${nfc.hasJournal ? 'Ya' : 'Tidak'}\n`;
      } 
      else if (item.productType === 'memory' && item.customizationDetails.memory) {
        const memory = item.customizationDetails.memory;
        message += `   • Nama: ${memory.names}\n`;
        message += `   • Ucapan: "${memory.wishMessage}"\n`;
        message += `   • Nuansa Bunga: ${memory.flowerTone}\n`;
        message += `   • Jenis Kayu Frame: ${memory.woodType}\n`;
      } 
      else if (item.productType === 'graduation' && item.customizationDetails.graduation) {
        const grad = item.customizationDetails.graduation;
        message += `   • Nama Wisudawan: ${grad.gradName}, ${grad.degree}\n`;
        message += `   • Universitas: ${grad.university}\n`;
        message += `   • Ucapan Wisuda: "${grad.specialMessage}"\n`;
        message += `   • Model Plakat: ${grad.plaqueStyle}\n`;
        message += `   • Upload Foto: ${grad.hasPhoto ? 'Ya' : 'Tidak'}\n`;
      }
    });

    message += `\n-----------------------\n`;
    message += `*Total Order:* ${formatRupiah(calculateTotal())}\n\n`;
    
    if (customerName) message += `*Nama Pemesan:* ${customerName}\n`;
    if (shippingAddress) message += `*Alamat Pengiriman:* ${shippingAddress}\n`;

    message += `\nMohon diinfokan kelanjutan pembayaran dan pengiriman barang ya kak. Terima kasih! ✨`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/628123456789?text=${encodedText}`; // Replacement placeholder phone number
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900 z-50 pointer-events-auto"
          />

          {/* Drawer */}
          <motion.div
            id="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-beige-50 shadow-2xl z-50 flex flex-col pointer-events-auto border-l border-brand-beige-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-brand-beige-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-semibold text-brand-brown-800 tracking-wide">
                  Keranjang Santara
                </span>
                <span className="bg-brand-brown-600 text-white text-xs px-2 py-0.5 rounded-full font-sans">
                  {cart.length}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 hover:bg-brand-beige-200 rounded-full transition-colors text-brand-brown-700 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <div className="p-4 bg-brand-beige-100 rounded-full text-brand-brown-600 animate-float">
                    <X className="w-8 h-8 opacity-40" />
                  </div>
                  <h4 className="font-serif text-lg text-brand-brown-800 font-medium">
                    Keranjang Kamu Kosong
                  </h4>
                  <p className="text-sm text-brand-brown-600 max-w-xs leading-relaxed">
                    Yuk pilih salah satu koleksi premium SANTARA dan mulai kustomisasi kenangan manis kamu.
                  </p>
                  <button
                    id="back-to-shop-btn"
                    onClick={onClose}
                    className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand-sunset-500 hover:text-brand-sunset-700 border-b border-brand-sunset-500 pb-0.5 transition-colors"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-brand-beige-200 shadow-sm hover:shadow-md transition-shadow flex gap-3"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-brand-beige-100">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-medium text-brand-brown-800 line-clamp-1">
                            {item.productName}
                          </h4>
                          <button
                            id={`remove-${item.id}`}
                            onClick={() => onRemove(item.id)}
                            className="text-brand-rose-300 hover:text-brand-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Show mini summary of customizations based on type */}
                        <div className="text-[11px] text-brand-brown-600 mt-1 space-y-0.5 bg-brand-beige-50 p-2 rounded-lg border border-brand-beige-100">
                          {item.productType === 'nfc' && item.customizationDetails.nfc && (
                            <>
                              <p>⚡ Playlist: <span className="font-medium text-brand-sunset-500">{item.customizationDetails.nfc.playlistName}</span></p>
                              <p>🌙 Suara: {item.customizationDetails.nfc.whiteNoise}</p>
                            </>
                          )}
                          {item.productType === 'memory' && item.customizationDetails.memory && (
                            <>
                              <p>🌸 Nama: <span className="font-medium text-brand-sunset-500">{item.customizationDetails.memory.names}</span></p>
                              <p>💐 Bunga: {item.customizationDetails.memory.flowerTone}</p>
                            </>
                          )}
                          {item.productType === 'graduation' && item.customizationDetails.graduation && (
                            <>
                              <p>🎓 Nama: <span className="font-medium text-brand-sunset-500">{item.customizationDetails.graduation.gradName}</span></p>
                              <p>🏛️ Sekolah: {item.customizationDetails.graduation.university}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-xs font-semibold text-brand-brown-800">
                          {formatRupiah(item.basePrice * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2 border border-brand-beige-200 rounded-full px-2.5 py-1 bg-brand-beige-100">
                          <button
                            id={`minus-qty-${item.id}`}
                            onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="p-0.5 text-brand-brown-700 hover:text-brand-brown-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-brand-brown-800 min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            id={`plus-qty-${item.id}`}
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-0.5 text-brand-brown-700 hover:text-brand-brown-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom calculation & checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-brand-beige-200 bg-white space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-brand-brown-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatRupiah(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-brown-600">
                    <span>Pengiriman</span>
                    <span className="italic text-[11px] text-brand-sunset-500">Dihitung saat konfirmasi WA</span>
                  </div>
                  <div className="border-t border-dashed border-brand-beige-200 pt-2 flex justify-between text-base font-serif font-semibold text-brand-brown-800">
                    <span>Total Estimasi</span>
                    <span className="text-brand-sunset-500">{formatRupiah(calculateTotal())}</span>
                  </div>
                </div>

                {/* Shipping & personal info inputs */}
                <div className="space-y-2 pt-2 border-t border-brand-beige-100">
                  <div>
                    <label className="block text-[10px] font-semibold text-brand-brown-600 uppercase tracking-wider mb-1">
                      Nama Kamu
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="Contoh: Farrel Nazwa"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-brand-cream text-brand-brown-800 placeholder-brand-brown-300 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-brand-brown-600 uppercase tracking-wider mb-1">
                      Alamat Delivery singkat
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={2}
                      placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-brand-beige-200 rounded-xl bg-brand-cream text-brand-brown-800 placeholder-brand-brown-300 focus:outline-none focus:ring-1 focus:ring-brand-sunset-400 resize-none"
                    />
                  </div>
                </div>

                <button
                  id="checkout-wa-btn"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 bg-brand-brown-800 hover:bg-brand-brown-950 text-white rounded-2xl flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  Kirim Kustomisasi ke WhatsApp
                </button>
                <p className="text-[10px] text-center text-brand-brown-600 max-w-[280px] mx-auto leading-relaxed">
                  Semua produk SANTARA diproses custom-handmade dengan perhatian tinggi pada detail.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
