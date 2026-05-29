export type ProductType = 'nfc' | 'memory' | 'graduation';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  description: string;
  image: string;
  badges: string[];
}

export interface NfcCustomization {
  playlistName: string;
  playlistUrl: string;
  nightAffirmation: string;
  whiteNoise: 'hujan' | 'pantai' | 'hutan' | 'api-unggun';
  hasJournal: boolean;
}

export interface MemoryCustomization {
  photoFile: string; // Base64 or template placeholder image
  names: string;      // Names (e.g. "Rian & Amel")
  wishMessage: string;// Custom greeting/message
  flowerTone: 'Aesthetic Pink' | 'Rustic Warm' | 'Calming Lilac' | 'Minimalist White';
  woodType: 'Natural Oak' | 'Classic Walnut' | 'Warm Maple';
}

export interface GraduationCustomization {
  gradName: string;
  university: string;
  degree: string;
  specialMessage: string;
  plaqueStyle: 'Classic Clear' | 'Frosted Aesthetic' | 'Chic Wood Accent';
  hasPhoto: boolean;
  photoFile: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productType: ProductType;
  productName: string;
  basePrice: number;
  quantity: number;
  imageUrl: string;
  customizationDetails: {
    nfc?: NfcCustomization;
    memory?: MemoryCustomization;
    graduation?: GraduationCustomization;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  productType: ProductType;
}
