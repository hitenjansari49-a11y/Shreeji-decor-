import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// --- Constants & Data ---

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB' },
  INR: { symbol: '₹', rate: 83.5, locale: 'en-IN' },
  AUD: { symbol: 'A$', rate: 1.52, locale: 'en-AU' },
  NZD: { symbol: 'NZ$', rate: 1.63, locale: 'en-NZ' },
  CAD: { symbol: 'C$', rate: 1.36, locale: 'en-CA' },
};

const CATEGORIES = [
  { id: 'canvas', name: 'Canvas & Wall Art' },
  { id: 'gifts', name: 'Personalized Gifts' },
  { id: 'home', name: 'Home & Living' },
];

const SUBCATEGORY_LABELS: Record<string, string> = {
  'canvas': 'Canvas Prints',
  'framed': 'Framed Canvas',
  'multi': 'Multi-Panel',
  'acrylic': 'Acrylic Prints',
  'metal': 'Metal Prints',
  'wood': 'Wood Prints',
  'tiles': 'Photo Tiles',
  'collage': 'Collage Canvas',
  'pillow': 'Photo Pillows',
  'blanket': 'Custom Blankets',
  'mug': 'Photo Mugs',
  'lamp': 'Moon Lamps',
  'nameplate': 'Name Plates',
  'clock': 'Photo Clocks',
  'bottle': 'Custom Bottles',
  'calendar': 'Calendars',
  'coaster': 'Coasters',
  'book': 'Photo Books',
  'magnet': 'Magnets'
};

const UNIVERSAL_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800";

const PRODUCTS = [
  // Canvas & Wall Art
  { id: 1, name: 'Canvas Prints', category: 'canvas', subCategory: 'canvas', basePrice: 4.20, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '8x8', priceMod: 1 }, { label: '12x12', priceMod: 1.5 }, { label: '16x20', priceMod: 2 }, { label: '24x36', priceMod: 3 }, { label: '30x40', priceMod: 4 }, { label: 'Custom Size', priceMod: 1 }] },
  { id: 2, name: 'Framed Canvas', category: 'canvas', subCategory: 'framed', basePrice: 15.00, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12x12', priceMod: 1.5 }, { label: '16x20', priceMod: 2 }] },
  { id: 3, name: 'Multi-Panel Canvas', category: 'canvas', subCategory: 'multi', basePrice: 29.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '3-Piece', priceMod: 1 }, { label: '5-Piece', priceMod: 1.5 }] },
  { id: 4, name: 'Acrylic Prints', category: 'canvas', subCategory: 'acrylic', basePrice: 22.20, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12x12', priceMod: 1 }, { label: '20x30', priceMod: 2.5 }] },
  { id: 5, name: 'Metal Prints', category: 'canvas', subCategory: 'metal', basePrice: 16.20, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12x12', priceMod: 1 }, { label: '20x30', priceMod: 2.5 }] },
  { id: 6, name: 'Wood Prints', category: 'canvas', subCategory: 'wood', basePrice: 24.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12x12', priceMod: 1 }, { label: '16x20', priceMod: 1.8 }] },
  { id: 7, name: 'Photo Tiles', category: 'canvas', subCategory: 'tiles', basePrice: 4.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '8x8', priceMod: 1 }] },
  { id: 8, name: 'Collage Canvas', category: 'canvas', subCategory: 'collage', basePrice: 12.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '16x20', priceMod: 1 }, { label: '20x30', priceMod: 1.5 }] },
  
  // Personalized Gifts
  { id: 9, name: 'Photo Pillow', category: 'gifts', subCategory: 'pillow', basePrice: 9.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12x12', priceMod: 1 }, { label: '16x16', priceMod: 1.3 }] },
  { id: 10, name: 'Custom Blanket', category: 'gifts', subCategory: 'blanket', basePrice: 24.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '30x40', priceMod: 1 }, { label: '50x60', priceMod: 1.8 }] },
  { id: 11, name: 'Magic Mug', category: 'gifts', subCategory: 'mug', basePrice: 12.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '11oz', priceMod: 1 }, { label: '15oz', priceMod: 1.4 }] },
  { id: 12, name: 'Moon Lamp', category: 'gifts', subCategory: 'lamp', basePrice: 19.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12cm', priceMod: 1 }, { label: '16cm', priceMod: 1.5 }] },
  { id: 13, name: 'Name Plate', category: 'gifts', subCategory: 'nameplate', basePrice: 14.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: 'Small', priceMod: 1 }, { label: 'Large', priceMod: 1.5 }] },
  { id: 14, name: 'Photo Clock', category: 'gifts', subCategory: 'clock', basePrice: 18.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '12 inch', priceMod: 1 }] },
  { id: 15, name: 'Custom Bottle', category: 'gifts', subCategory: 'bottle', basePrice: 16.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '500ml', priceMod: 1 }, { label: '750ml', priceMod: 1.4 }] },

  // Home & Living
  { id: 16, name: 'Photo Calendar', category: 'home', subCategory: 'calendar', basePrice: 14.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: 'Desk', priceMod: 1 }, { label: 'Wall', priceMod: 1.5 }] },
  { id: 17, name: 'Photo Coasters', category: 'home', subCategory: 'coaster', basePrice: 9.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: 'Set of 4', priceMod: 1 }, { label: 'Set of 6', priceMod: 1.4 }] },
  { id: 18, name: 'Photo Photo Book', category: 'home', subCategory: 'book', basePrice: 19.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '20 Pages', priceMod: 1 }, { label: '40 Pages', priceMod: 1.5 }] },
  { id: 19, name: 'Photo Magnets', category: 'home', subCategory: 'magnet', basePrice: 2.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: 'Set of 2', priceMod: 1 }] },
  { id: 20, name: 'Standard Mug', category: 'home', subCategory: 'mug', basePrice: 4.99, image: UNIVERSAL_PRODUCT_IMAGE, sizes: [{ label: '11oz', priceMod: 1 }] },
];

const CHRISTMAS_BUNDLES = [
  { id: 'b1', name: 'Family Memory Bundle', items: ['Canvas Print (16x20)', 'Photo Pillow (16x16)', 'Custom Blanket (50x60)'], price: 39.99, originalPrice: 65.00, image: UNIVERSAL_PRODUCT_IMAGE },
  { id: 'b2', name: 'Cozy Winter Set', items: ['Custom Blanket', 'Magic Mug', 'Photo Socks'], price: 34.99, originalPrice: 55.00, image: UNIVERSAL_PRODUCT_IMAGE },
  { id: 'b3', name: 'Stocking Stuffers', items: ['Keychain', 'Magnet', 'Ornament', 'Mini Canvas'], price: 19.99, originalPrice: 35.00, image: UNIVERSAL_PRODUCT_IMAGE },
];

const COLLAGE_TEMPLATES = [
  { id: 'grid2', name: '2-Split', slots: 2, layout: 'grid-cols-2' },
  { id: 'grid2v', name: '2-Row', slots: 2, layout: 'grid-rows-2' },
  { id: 'grid3h', name: '3-Col', slots: 3, layout: 'grid-cols-3' },
  { id: 'grid3v', name: '3-Row', slots: 3, layout: 'grid-rows-3' },
  { id: 'grid4', name: '2x2 Grid', slots: 4, layout: 'grid-cols-2 grid-rows-2' },
  { id: 'mix3', name: 'Feature Left', slots: 3, layout: 'grid-cols-2 grid-rows-2', slotClasses: { 0: 'row-span-2' } },
  { id: 'mix3r', name: 'Feature Right', slots: 3, layout: 'grid-cols-2 grid-rows-2', slotClasses: { 2: 'row-span-2' } },
  { id: 'grid6', name: '6-Grid', slots: 6, layout: 'grid-cols-3 grid-rows-2' },
];

const UPI_QR_IMAGE = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=hitenjansari49@oksbi&pn=ShreejiStudio&cu=INR";
const UPI_ID = "hitenjansari49@oksbi";
const UPI_PAYMENT_LINK = "upi://pay?pa=hitenjansari49@oksbi&pn=ShreejiStudio&cu=INR";

// --- Interfaces ---

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  basePrice: number;
  image: string;
  sizes: { label: string; priceMod: number }[];
  features?: string[];
}

interface ImageEdits {
  brightness: number;
  contrast: number;
  rotate: number;
  scale: number;
  panX: number;
  panY: number;
  saturation: number;
  hue: number;
}

interface CartItem {
  id: string | number;
  productName: string;
  totalPrice: number;
  quantity: number;
  uploadedImage?: string;
  size: string;
  customWidth?: number;
  customHeight?: number;
  customOptions?: Record<string, any>;
  imageEdits?: ImageEdits | ImageEdits[];
  collageLayoutId?: string;
  collageImages?: Record<number, string>;
}

interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const DEFAULT_EDITS: ImageEdits = {
  brightness: 100,
  contrast: 100,
  rotate: 0,
  scale: 1,
  panX: 0,
  panY: 0,
  saturation: 100,
  hue: 0
};

// --- Currency Context ---

const CurrencyContext = createContext<any>(null);

const CurrencyProvider = ({ children }: any) => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (priceInUSD: number) => {
    const { rate, locale } = CURRENCIES[currency as keyof typeof CURRENCIES];
    // Ensure we convert correctly
    const converted = priceInUSD * rate;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

const useCurrency = () => useContext(CurrencyContext);


// --- Components ---

function Header({ setView, cartCount, isChristmasMode, toggleChristmasMode }: any) {
  const { currency, setCurrency } = useCurrency();

  return (
    <header className={`sticky top-0 z-50 shadow-md transition-colors duration-500 ${isChristmasMode ? 'bg-brand-christmasRed text-white' : 'bg-brand-navy text-white'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 onClick={() => setView('home')} className="text-2xl font-serif font-bold cursor-pointer flex items-center gap-2">
            {isChristmasMode && <i className="fas fa-sleigh animate-bounce"></i>}
            Shreeji Decor
            </h1>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <button onClick={() => setView('home')} className="hover:text-brand-gold transition">Home</button>
          <button onClick={() => setView('shop-canvas')} className="hover:text-brand-gold transition">Canvas & Art</button>
          <button onClick={() => setView('shop-gifts')} className="hover:text-brand-gold transition">Gifts</button>
          <button onClick={() => setView('occasions')} className="hover:text-brand-gold transition">Occasions</button>
        </nav>

        <div className="flex items-center gap-4">
           {/* Instagram Link */}
           <a href="https://www.instagram.com/sofabydad" target="_blank" className="hover:text-brand-gold transition mr-1" title="Follow us on Instagram">
             <i className="fab fa-instagram text-xl"></i>
           </a>

           {/* Currency Selector */}
           <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className={`text-xs p-1 rounded border-none outline-none font-bold cursor-pointer ${isChristmasMode ? 'bg-red-800 text-white' : 'bg-brand-navy text-brand-gold border-brand-gold border'}`}
            >
              {Object.keys(CURRENCIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
           </select>

          <button 
            onClick={toggleChristmasMode}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-2
              ${isChristmasMode 
                ? 'bg-white text-brand-christmasRed border-white shadow-[0_0_10px_#fff]' 
                : 'bg-transparent text-brand-gold border-brand-gold animate-pulse hover:bg-brand-gold hover:text-brand-navy'
              }`}
          >
            {isChristmasMode ? 'Disable 🎄' : 'Enable Christmas Mode 🎄'}
          </button>
          
          <button onClick={() => setView('cart')} className="relative hover:text-brand-gold transition">
            <i className="fas fa-shopping-cart text-xl"></i>
            {cartCount > 0 && (
              <span className={`absolute -top-2 -right-2 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${isChristmasMode ? 'bg-white text-red-600' : 'bg-brand-gold text-brand-navy'}`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around py-3 text-xs border-t border-opacity-20 items-center bg-inherit">
         <button onClick={() => setView('shop-canvas')} className="flex flex-col items-center gap-1 opacity-90">
             <i className="fas fa-image text-sm mb-0.5"></i> Canvas
         </button>
         <button onClick={() => setView('shop-gifts')} className="flex flex-col items-center gap-1 opacity-90">
             <i className="fas fa-gift text-sm mb-0.5"></i> Gifts
         </button>
         <button onClick={() => setView('occasions')} className="flex flex-col items-center gap-1 opacity-90">
             <i className="fas fa-calendar text-sm mb-0.5"></i> Occasions
         </button>
         <a href="https://wa.me/919106038302" target="_blank" className="flex flex-col items-center gap-1 text-green-400 font-bold animate-pulse">
             <i className="fab fa-whatsapp text-lg mb-0.5"></i> Help
         </a>
      </div>
    </header>
  );
}

function HeroBanner({ isChristmasMode, setView }: any) {
    if (isChristmasMode) {
        return (
            <div className="relative bg-gradient-to-r from-red-700 to-green-900 text-white p-8 md:p-16 rounded-2xl mb-12 shadow-2xl overflow-hidden">
                <div className="santa-sleigh text-6xl">🛷🎅</div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>
                <div className="relative z-10 text-center md:text-left">
                    <div className="inline-block bg-white text-red-700 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-bounce">
                        🎄 Christmas Sale is Live!
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                        Gift Memories <br/> This Christmas
                    </h2>
                    <p className="text-xl mb-8 opacity-90">Up to 40% OFF on Custom Canvas & Gifts</p>
                    <CountdownTimer className="mb-8 justify-center md:justify-start" />
                    <button onClick={() => setView('shop-canvas')} className="bg-brand-gold text-brand-navy px-8 py-3 rounded-full font-bold text-lg hover:bg-white transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Shop Christmas Deals <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        )
    }
  return (
    <div className="relative bg-brand-navy text-white p-12 md:p-24 rounded-2xl mb-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
         <img src={UNIVERSAL_PRODUCT_IMAGE} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 max-w-xl">
        <h2 className="text-5xl font-serif font-bold mb-6">Turn Photos into <span className="text-brand-gold">Masterpieces</span></h2>
        <p className="text-lg mb-8 text-gray-300">Premium quality custom canvas prints, personalized gifts, and home decor handcrafted with love.</p>
        <button onClick={() => setView('shop-canvas')} className="bg-brand-gold text-brand-navy px-8 py-3 rounded-full font-bold hover:bg-white transition">Start Creating</button>
      </div>
    </div>
  );
}

function CountdownTimer({ className = "" }: { className?: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 5); // 5 days from now
        
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex gap-4 ${className}`}>
            {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] text-center border border-white/30">
                        <span className="text-2xl font-bold font-mono">{String(item.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs mt-1 uppercase tracking-wider opacity-80">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

function FilterSection({ subCategories, onFilterChange, onPriceChange }: any) {
  const { formatPrice } = useCurrency();
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
      <select 
        onChange={(e) => onFilterChange(e.target.value)}
        className="p-2 border rounded hover:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
      >
        <option value="all">All Categories</option>
        {subCategories.map((sub: string) => (
          <option key={sub} value={sub}>{SUBCATEGORY_LABELS[sub] || sub}</option>
        ))}
      </select>
      
      <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
        <button onClick={() => onPriceChange('all')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50 whitespace-nowrap">All Prices</button>
        <button onClick={() => onPriceChange('low')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50 whitespace-nowrap">Under {formatPrice(20)}</button>
        <button onClick={() => onPriceChange('mid')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50 whitespace-nowrap">{formatPrice(20)} - {formatPrice(50)}</button>
        <button onClick={() => onPriceChange('high')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50 whitespace-nowrap">Over {formatPrice(50)}</button>
      </div>
    </div>
  );
}

function ProductGrid({ products, setProduct, isChristmasMode }: any) {
  const { formatPrice } = useCurrency();
  const getRating = (pid: number) => {
     // Mock logic for rating
     return 4 + (pid % 10) / 10; 
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: Product) => (
        <div key={product.id} onClick={() => setProduct(product)} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 relative">
          {isChristmasMode && (
             <div className="absolute top-2 right-2 z-10 text-2xl drop-shadow-md animate-pulse">🎅</div>
          )}
          <div className="h-48 overflow-hidden bg-gray-100 relative">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <span className="bg-white text-brand-navy px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">Design Now</span>
             </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
            </div>
            <div className="flex items-center gap-1 mb-2 text-yellow-500 text-xs">
                {[1,2,3,4,5].map(star => <i key={star} className={`fas fa-star ${star <= getRating(product.id) ? '' : 'text-gray-300'}`}></i>)}
                <span className="text-gray-400 ml-1">({10 + product.id * 2})</span>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-brand-navy font-bold text-lg">{formatPrice(product.basePrice)}</p>
                <span className="text-xs text-brand-gold uppercase tracking-wider font-bold">Customize <i className="fas fa-chevron-right ml-1"></i></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesignView({ product, onAddToCart, setView, isChristmasMode, allProducts, setProduct, onAddReview, reviews }: any) {
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [customWidth, setCustomWidth] = useState(12);
  const [customHeight, setCustomHeight] = useState(12);
  const [wrapStyle, setWrapStyle] = useState('image'); // image, mirror, color
  
  // Image Edit State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageEdits, setImageEdits] = useState<ImageEdits>(DEFAULT_EDITS);
  
  // Collage State
  const isCollage = product.subCategory === 'collage' || product.subCategory === 'multi';
  const [collageLayout, setCollageLayout] = useState(COLLAGE_TEMPLATES[0]);
  const [collageImages, setCollageImages] = useState<Record<number, string>>({});
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [allImageEdits, setAllImageEdits] = useState<Record<number, ImageEdits>>({});
  
  // Reset when product changes
  useEffect(() => {
     setSelectedSize(product.sizes[0]);
     setUploadedImage(null);
     setCollageImages({});
     setImageEdits(DEFAULT_EDITS);
     setAllImageEdits({});
     // If switching products, reset custom size defaults
     setCustomWidth(12);
     setCustomHeight(12);
  }, [product]);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const productReviews = reviews.filter((r: Review) => r.productId === product.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number = -1) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isCollage && slotIndex >= 0) {
            setCollageImages(prev => ({...prev, [slotIndex]: result}));
            setAllImageEdits(prev => ({...prev, [slotIndex]: DEFAULT_EDITS}));
            setActiveSlot(slotIndex);
        } else {
            setUploadedImage(result);
            setImageEdits(DEFAULT_EDITS);
        }
      };
      reader.readAsDataURL(file);
      // Reset input
      e.target.value = '';
    }
  };

  const calculateCustomPrice = () => {
     const area = customWidth * customHeight;
     // Base formula approximation matching standard sizes
     // e.g. 8x8 (64sqin) = $4.20 -> ~$0.065/sqin 
     // decreasing as size increases
     let pricePerSqIn = 0.06;
     if (area > 500) pricePerSqIn = 0.04;
     if (area > 1000) pricePerSqIn = 0.03;
     
     return Math.max(4.20, area * pricePerSqIn);
  };

  const getPrice = () => {
      let price = 0;
      if (selectedSize.label === 'Custom Size') {
          price = calculateCustomPrice();
      } else {
          price = product.basePrice * selectedSize.priceMod;
      }
      
      // Add wrap cost
      if (wrapStyle === 'mirror') price += 2;
      if (wrapStyle === 'color') price += 1;
      
      return price;
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: Date.now(),
      productName: product.name,
      totalPrice: getPrice(),
      quantity: 1,
      uploadedImage: isCollage ? collageImages[0] : uploadedImage,
      size: selectedSize.label === 'Custom Size' ? `${customWidth}x${customHeight}"` : selectedSize.label,
      customWidth: selectedSize.label === 'Custom Size' ? customWidth : undefined,
      customHeight: selectedSize.label === 'Custom Size' ? customHeight : undefined,
      customOptions: { wrapStyle },
      imageEdits: isCollage ? allImageEdits : imageEdits,
      collageLayoutId: isCollage ? collageLayout.id : undefined,
      collageImages: isCollage ? collageImages : undefined
    });
    setView('cart');
  };
  
  const currentEdits = isCollage ? (allImageEdits[activeSlot] || DEFAULT_EDITS) : imageEdits;
  const updateEdits = (key: keyof ImageEdits, value: number) => {
      if (isCollage) {
          setAllImageEdits(prev => ({
              ...prev,
              [activeSlot]: { ...currentEdits, [key]: value }
          }));
      } else {
          setImageEdits(prev => ({ ...prev, [key]: value }));
      }
  };

  // Nav Logic
  const categoryProducts = allProducts.filter((p: Product) => p.category === product.category);
  const currentIndex = categoryProducts.findIndex((p: Product) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Nav */}
      <div className="flex justify-between mb-6">
        <button onClick={() => setView('home')} className="flex items-center text-gray-600 hover:text-brand-navy">
            <i className="fas fa-arrow-left mr-2"></i> Back to Shop
        </button>
        <div className="flex gap-4">
            <button 
                disabled={!prevProduct}
                onClick={() => setProduct(prevProduct)}
                className={`px-4 py-2 border rounded ${!prevProduct ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
                <i className="fas fa-chevron-left mr-2"></i> Prev Product
            </button>
            <button 
                disabled={!nextProduct}
                onClick={() => setProduct(nextProduct)}
                className={`px-4 py-2 border rounded ${!nextProduct ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
                Next Product <i className="fas fa-chevron-right ml-2"></i>
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-2xl shadow-xl">
        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
           {isChristmasMode && (
               <div className="absolute top-0 left-0 w-full flex justify-between px-4 z-20 pointer-events-none">
                   {[...Array(6)].map((_, i) => (
                       <div key={i} className={`w-4 h-8 rounded-b-full shadow-md animate-[twinkle_2s_infinite_${i*0.3}s] ${i%2===0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                   ))}
               </div>
           )}
           
           <h2 className="text-3xl font-serif font-bold mb-4 text-brand-navy">{product.name}</h2>
           
           <div 
             className={`relative bg-white shadow-2xl transition-all duration-300 overflow-hidden group select-none ${isCollage ? collageLayout.layout + ' grid gap-1 p-1 bg-gray-200' : ''}`}
             style={{ 
                 width: '100%', 
                 maxWidth: '400px', 
                 aspectRatio: selectedSize.label === 'Custom Size' ? `${customWidth}/${customHeight}` : '1/1',
                 minHeight: '300px'
             }}
           >
             {isCollage ? (
                 // Collage Grid
                 Array.from({ length: collageLayout.slots }).map((_, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => setActiveSlot(idx)}
                        className={`relative bg-gray-50 overflow-hidden cursor-pointer border-2 ${activeSlot === idx ? 'border-brand-gold' : 'border-transparent hover:border-gray-300'} ${(collageLayout as any).slotClasses?.[idx] || ''}`}
                     >
                        {collageImages[idx] ? (
                             <img 
                                src={collageImages[idx]} 
                                className="w-full h-full object-cover"
                                style={{
                                    transform: `scale(${allImageEdits[idx]?.scale || 1}) rotate(${allImageEdits[idx]?.rotate || 0}deg) translate(${allImageEdits[idx]?.panX || 0}px, ${allImageEdits[idx]?.panY || 0}px)`,
                                    filter: `brightness(${allImageEdits[idx]?.brightness || 100}%) contrast(${allImageEdits[idx]?.contrast || 100}%) saturate(${allImageEdits[idx]?.saturation || 100}%) hue-rotate(${allImageEdits[idx]?.hue || 0}deg)`,
                                    transformOrigin: 'center'
                                }}
                             />
                        ) : (
                             <label className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer">
                                <i className="fas fa-plus text-2xl mb-2"></i>
                                <span className="text-xs">Add Photo</span>
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, idx)} />
                             </label>
                        )}
                     </div>
                 ))
             ) : (
                 // Single Image Canvas
                 <div className="relative w-full h-full">
                     {uploadedImage ? (
                        <div className="absolute inset-0 overflow-hidden">
                             <img 
                                key={uploadedImage} // Force re-render on new image
                                src={uploadedImage} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                style={{
                                    transform: `scale(${imageEdits.scale}) rotate(${imageEdits.rotate}deg) translate(${imageEdits.panX}px, ${imageEdits.panY}px)`,
                                    filter: `brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%) hue-rotate(${imageEdits.hue}deg)`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                     ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 cursor-pointer border-2 border-dashed border-gray-300">
                             <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                             <span>Click to Upload Image</span>
                             <input 
                                type="file" 
                                hidden 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e)}
                                onClick={(e: any) => e.target.value = null} // Reset to allow re-upload same file
                             />
                        </label>
                     )}
                     
                     {/* Overlays like Christmas Sticker */}
                     {isChristmasMode && <img src="https://cdn-icons-png.flaticon.com/512/744/744546.png" className="absolute -top-4 -right-4 w-16 h-16 drop-shadow-lg z-10" />}
                 </div>
             )}
           </div>

           {/* Toolbar */}
           {(uploadedImage || (isCollage && collageImages[activeSlot])) && (
               <div className="mt-6 bg-white p-4 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">
                  <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-sm text-brand-navy">Edit Image {isCollage && `#${activeSlot + 1}`}</span>
                      <button onClick={() => isCollage ? setAllImageEdits(prev => ({...prev, [activeSlot]: DEFAULT_EDITS})) : setImageEdits(DEFAULT_EDITS)} className="text-xs text-red-500 hover:underline">Reset</button>
                  </div>
                  
                  {/* Pan Controls */}
                   <div className="flex justify-center mb-4">
                      <div className="grid grid-cols-3 gap-1">
                          <div className="w-8 h-8"></div>
                          <button onClick={() => updateEdits('panY', currentEdits.panY - 10)} className="w-8 h-8 bg-brand-navy text-white rounded hover:bg-brand-gold"><i className="fas fa-arrow-up text-xs"></i></button>
                          <div className="w-8 h-8"></div>
                          <button onClick={() => updateEdits('panX', currentEdits.panX - 10)} className="w-8 h-8 bg-brand-navy text-white rounded hover:bg-brand-gold"><i className="fas fa-arrow-left text-xs"></i></button>
                          <button onClick={() => { if(isCollage) setAllImageEdits(prev => ({...prev, [activeSlot]: {...currentEdits, panX:0, panY:0}})); else setImageEdits(prev => ({...prev, panX:0, panY:0})); }} className="w-8 h-8 bg-gray-200 rounded text-xs hover:bg-gray-300"><i className="fas fa-crosshairs"></i></button>
                          <button onClick={() => updateEdits('panX', currentEdits.panX + 10)} className="w-8 h-8 bg-brand-navy text-white rounded hover:bg-brand-gold"><i className="fas fa-arrow-right text-xs"></i></button>
                          <div className="w-8 h-8"></div>
                          <button onClick={() => updateEdits('panY', currentEdits.panY + 10)} className="w-8 h-8 bg-brand-navy text-white rounded hover:bg-brand-gold"><i className="fas fa-arrow-down text-xs"></i></button>
                          <div className="w-8 h-8"></div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                          <label className="flex justify-between mb-1">Zoom <span>{currentEdits.scale}x</span></label>
                          <input type="range" min="0.1" max="5" step="0.05" value={currentEdits.scale} onChange={(e) => updateEdits('scale', parseFloat(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                      <div>
                          <label className="flex justify-between mb-1">Rotate <span>{currentEdits.rotate}°</span></label>
                          <input type="range" min="0" max="360" value={currentEdits.rotate} onChange={(e) => updateEdits('rotate', parseInt(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                      <div>
                          <label className="flex justify-between mb-1">Brightness</label>
                          <input type="range" min="0" max="200" value={currentEdits.brightness} onChange={(e) => updateEdits('brightness', parseInt(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                      <div>
                          <label className="flex justify-between mb-1">Contrast</label>
                          <input type="range" min="0" max="200" value={currentEdits.contrast} onChange={(e) => updateEdits('contrast', parseInt(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                      <div>
                          <label className="flex justify-between mb-1">Saturation</label>
                          <input type="range" min="0" max="200" value={currentEdits.saturation} onChange={(e) => updateEdits('saturation', parseInt(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                      <div>
                          <label className="flex justify-between mb-1">Hue</label>
                          <input type="range" min="0" max="360" value={currentEdits.hue} onChange={(e) => updateEdits('hue', parseInt(e.target.value))} className="w-full accent-brand-navy" />
                      </div>
                  </div>
               </div>
           )}
        </div>

        {/* Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-6 h-fit overflow-y-auto">
           {isCollage && (
               <div>
                   <h3 className="font-bold mb-2 text-brand-navy">Select Layout</h3>
                   <div className="grid grid-cols-4 gap-2">
                       {COLLAGE_TEMPLATES.map(t => (
                           <button 
                                key={t.id} 
                                onClick={() => { setCollageLayout(t); setCollageImages({}); }} // Reset images on layout change
                                className={`border p-2 rounded text-xs flex flex-col items-center gap-1 ${collageLayout.id === t.id ? 'bg-brand-navy text-white' : 'hover:bg-gray-50'}`}
                            >
                               <div className={`w-6 h-6 border border-current grid gap-0.5 ${t.layout} w-full`}>
                                   {[...Array(t.slots)].map((_, i) => <div key={i} className={`bg-current opacity-20 ${(t as any).slotClasses?.[i] || ''}`}></div>)}
                               </div>
                               <span className="text-[10px] whitespace-nowrap overflow-hidden">{t.name}</span>
                           </button>
                       ))}
                   </div>
               </div>
           )}

           <div>
              <h3 className="font-bold mb-2 text-brand-navy">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                 {product.sizes.map((size: any) => (
                    <button 
                       key={size.label} 
                       onClick={() => setSelectedSize(size)}
                       className={`px-4 py-2 border rounded-lg transition-all ${selectedSize.label === size.label ? 'bg-brand-navy text-white shadow-md' : 'bg-white hover:border-brand-navy'}`}
                    >
                       {size.label}
                    </button>
                 ))}
              </div>
              
              {selectedSize.label === 'Custom Size' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex gap-4 items-center mb-2">
                          <div className="flex flex-col">
                              <label className="text-xs font-bold mb-1">Width (in)</label>
                              <input type="number" min="8" max="60" value={customWidth} onChange={(e) => setCustomWidth(parseInt(e.target.value))} className="p-2 w-20 border rounded text-center" />
                          </div>
                          <span className="text-xl">x</span>
                          <div className="flex flex-col">
                              <label className="text-xs font-bold mb-1">Height (in)</label>
                              <input type="number" min="8" max="60" value={customHeight} onChange={(e) => setCustomHeight(parseInt(e.target.value))} className="p-2 w-20 border rounded text-center" />
                          </div>
                      </div>
                      <p className="text-xs text-yellow-800"><i className="fas fa-info-circle"></i> Enter dimensions in inches.</p>
                  </div>
              )}
           </div>

           {(product.category === 'canvas') && (
               <div>
                   <h3 className="font-bold mb-2 text-brand-navy">Wrap Style</h3>
                   <div className="grid grid-cols-3 gap-2">
                       <button onClick={() => setWrapStyle('image')} className={`border p-2 rounded text-xs ${wrapStyle === 'image' ? 'border-brand-navy bg-blue-50' : ''}`}>Image Wrap</button>
                       <button onClick={() => setWrapStyle('mirror')} className={`border p-2 rounded text-xs ${wrapStyle === 'mirror' ? 'border-brand-navy bg-blue-50' : ''}`}>Mirror Wrap (+$2)</button>
                       <button onClick={() => setWrapStyle('color')} className={`border p-2 rounded text-xs ${wrapStyle === 'color' ? 'border-brand-navy bg-blue-50' : ''}`}>Color Wrap (+$1)</button>
                   </div>
               </div>
           )}
           
           {/* Price Footer */}
           <div className="bg-gray-50 p-4 rounded-xl mt-auto">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-500 font-medium">Total Price</span>
                 <span className="text-3xl font-serif font-bold text-brand-navy transition-all duration-300 transform scale-105">
                     {selectedSize.label === 'Custom Size' ? (
                         <span className="text-xl">Approx. {formatPrice(getPrice() * 0.95)} - {formatPrice(getPrice() * 1.05)}</span>
                     ) : (
                         formatPrice(getPrice())
                     )}
                 </span>
              </div>
              <button onClick={handleAddToCart} className="w-full bg-brand-gold text-brand-navy py-4 rounded-xl font-bold text-lg hover:bg-white hover:shadow-lg transition flex items-center justify-center gap-2">
                 <i className="fas fa-cart-plus"></i> Add to Cart
              </button>
              {product.features && (
                  <div className="mt-4 text-xs text-gray-500">
                      <p className="font-bold mb-1">Includes:</p>
                      <ul className="list-disc pl-4 space-y-1">
                          {product.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                      </ul>
                  </div>
              )}
              <a 
                href={`https://wa.me/919106038302?text=I'm interested in ${product.name}`} 
                target="_blank"
                className="mt-3 w-full border border-green-500 text-green-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition"
              >
                 <i className="fab fa-whatsapp text-xl"></i> Order via WhatsApp
              </a>
           </div>

           {/* Reviews Section */}
           <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-xl mb-4">Customer Reviews</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                 {productReviews.length > 0 ? productReviews.map((r: Review) => (
                    <div key={r.id} className="bg-gray-50 p-3 rounded text-sm">
                       <div className="flex justify-between mb-1">
                          <span className="font-bold">{r.userName}</span>
                          <div className="text-yellow-500 text-xs">
                             {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < r.rating ? '' : 'text-gray-300'}`}></i>)}
                          </div>
                       </div>
                       <p className="text-gray-600 italic">"{r.comment}"</p>
                    </div>
                 )) : <p className="text-gray-400 text-sm">No reviews yet.</p>}
              </div>
              
              <div className="bg-white p-4 border rounded-lg">
                 <h4 className="font-bold text-sm mb-2">Write a Review</h4>
                 <div className="flex gap-2 mb-2 text-gray-300">
                     {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)} className={s <= rating ? 'text-yellow-500' : ''}><i className="fas fa-star"></i></button>
                     ))}
                 </div>
                 <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." className="w-full border p-2 rounded text-sm mb-2" rows={2}></textarea>
                 <button 
                    onClick={() => {
                        onAddReview({ id: Date.now(), productId: product.id, userName: 'Guest User', rating, comment, date: new Date().toISOString() });
                        setComment('');
                    }}
                    className="bg-brand-navy text-white px-4 py-2 rounded text-xs font-bold"
                 >
                    Submit Review
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function CartView({ cart, updateQuantity, removeCartItem, setView }: any) {
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.totalPrice * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 69 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-serif font-bold mb-8 text-brand-navy">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <button onClick={() => setView('shop-canvas')} className="bg-brand-gold text-brand-navy px-6 py-2 rounded font-bold">Start Shopping</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="flex gap-4 border-b py-4 last:border-b-0">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden relative">
                   {item.collageLayoutId ? (
                       <div className={`grid gap-0.5 w-full h-full ${COLLAGE_TEMPLATES.find(t => t.id === item.collageLayoutId)?.layout || 'grid-cols-2'}`}>
                           {item.collageImages && Object.values(item.collageImages).slice(0, 4).map((img, i) => (
                               <img key={i} src={img} className="w-full h-full object-cover" />
                           ))}
                       </div>
                   ) : (
                       item.uploadedImage ? <img src={item.uploadedImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>
                   )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-navy">{item.productName}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border rounded hover:bg-gray-100">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 border rounded hover:bg-gray-100">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(item.totalPrice * item.quantity)}</p>
                  <button onClick={() => removeCartItem(item.id)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-4">Summary</h3>
            <div className="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between mb-2 text-sm"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between mb-4 text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button onClick={() => setView('checkout')} className="w-full bg-brand-navy text-white py-3 rounded font-bold hover:bg-opacity-90">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutView({ cart, onPlaceOrder, setView, isChristmasMode }: any) {
  const { formatPrice } = useCurrency();
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.totalPrice * item.quantity, 0);
  const total = subtotal + (subtotal * 0.08) + (subtotal > 69 ? 0 : 9.99);

  const [form, setForm] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
        if (value && !validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }
  };

  const handlePlaceOrder = () => {
    if(!form.email || emailError) { alert('Please enter a valid email.'); return; }
    
    // Create order object first
    const orderId = Date.now();
    const orderDetails = {
        id: orderId,
        customer: form,
        items: cart,
        total,
        paymentMethod,
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Construct the message
    const itemsList = cart.map((i: any) => `- ${i.productName} (${i.size}) x${i.quantity}`).join('\n');
    const message = `
*New Order Placed!* 🛍️
*Order ID:* #${orderId}
*Customer:* ${form.firstName} ${form.lastName}
*Phone:* ${form.phone}
*Email:* ${form.email}
*Total:* $${total.toFixed(2)}

*Items:*
${itemsList}

*Address:* ${form.address}, ${form.city}, ${form.zip}
*Payment:* ${paymentMethod}
    `.trim();

    // Trigger WhatsApp
    const whatsappUrl = `https://wa.me/919106038302?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Trigger Email
    const mailtoUrl = `mailto:canvasmaster7@gmail.com?subject=New Order #${orderId}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;

    // Finally save order in app state
    onPlaceOrder(form, total, paymentMethod, orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-serif font-bold mb-6 text-brand-navy">Checkout</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <input name="firstName" placeholder="First Name" onChange={handleInputChange} className="border p-2 rounded" />
             <input name="lastName" placeholder="Last Name" onChange={handleInputChange} className="border p-2 rounded" />
          </div>
          <div className="mb-4">
            <input name="email" placeholder="Email Address" onChange={handleInputChange} className={`w-full border p-2 rounded ${emailError ? 'border-red-500' : ''}`} />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>
          <div className="mb-4">
             <input name="phone" placeholder="Phone Number" onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-4">
             <input name="address" placeholder="Street Address" onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
             <input name="city" placeholder="City" onChange={handleInputChange} className="border p-2 rounded" />
             <input name="state" placeholder="State" onChange={handleInputChange} className="border p-2 rounded" />
             <input name="zip" placeholder="Zip Code" onChange={handleInputChange} className="border p-2 rounded" />
          </div>
          
          <h3 className="font-bold mb-4">Payment Method</h3>
          <div className="space-y-3">
             <label className="flex items-center gap-2 border p-3 rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <i className="fas fa-credit-card text-brand-navy"></i> Credit/Debit Card
             </label>
             <label className="flex items-center gap-2 border p-3 rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                <i className="fab fa-paypal text-blue-600"></i> PayPal
             </label>
             
             {/* Scan & Pay Option */}
             <div className={`border rounded transition-all duration-300 ${paymentMethod === 'upi' ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                <label className="flex items-center gap-2 p-3 cursor-pointer">
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                    <i className="fas fa-qrcode text-green-600"></i> Scan & Pay (UPI)
                </label>
                {paymentMethod === 'upi' && (
                    <div className="p-4 border-t border-blue-100 flex flex-col items-center animate-fade-in-up">
                        <div className="bg-white p-2 rounded shadow-sm mb-3">
                            <img src={UPI_QR_IMAGE} alt="UPI QR" className="w-40 h-40 object-contain" />
                        </div>
                        <p className="font-bold text-brand-navy mb-1 text-sm">{UPI_ID}</p>
                        <p className="text-xs text-gray-500 mb-3">Scan with GPay, PhonePe, Paytm</p>
                        <a href={UPI_PAYMENT_LINK} className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition">
                            <i className="fas fa-mobile-alt mr-2"></i> Pay via UPI App
                        </a>
                    </div>
                )}
             </div>

             <label className="flex items-center gap-2 border p-3 rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <i className="fas fa-money-bill-wave text-green-600"></i> Cash on Delivery
             </label>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-gray-50 p-6 rounded-lg h-fit">
           <h3 className="font-bold text-xl mb-4">Order Summary</h3>
           <div className="space-y-2 mb-4">
              {cart.map((item: CartItem) => (
                 <div key={item.id} className="flex justify-between text-sm">
                    <span className="line-clamp-1 w-2/3">{item.productName} (x{item.quantity})</span>
                    <span>{formatPrice(item.totalPrice * item.quantity)}</span>
                 </div>
              ))}
           </div>
           <div className="border-t pt-4 font-bold text-lg flex justify-between mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
           </div>
           <button 
             onClick={handlePlaceOrder}
             className={`w-full py-3 rounded font-bold text-white shadow-lg transform active:scale-95 transition-all ${isChristmasMode ? 'bg-brand-christmasRed hover:bg-red-700' : 'bg-brand-gold text-brand-navy hover:bg-white'}`}
            >
             Place Order
           </button>
        </div>
      </div>
    </div>
  );
}

function OrderSuccessView({ lastOrder, setView }: any) {
  if (!lastOrder) return null;

  const orderDetailsText = `
*New Order Received!* 🛍️
*Order ID:* #${lastOrder.id}
*Customer:* ${lastOrder.customer.firstName} ${lastOrder.customer.lastName}
*Phone:* ${lastOrder.customer.phone}
*Email:* ${lastOrder.customer.email}
*Total:* $${lastOrder.total.toFixed(2)}

*Items:*
${lastOrder.items.map((i: any) => `- ${i.productName} (${i.size}) x${i.quantity}`).join('\n')}

*Address:* ${lastOrder.customer.address}, ${lastOrder.customer.city}, ${lastOrder.customer.zip}
*Payment:* ${lastOrder.paymentMethod}
  `.trim();

  const whatsappLink = `https://wa.me/919106038302?text=${encodeURIComponent(orderDetailsText)}`;
  const mailtoLink = `mailto:canvasmaster7@gmail.com?subject=New Order #${lastOrder.id}&body=${encodeURIComponent(orderDetailsText)}`;

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">
        <i className="fas fa-check"></i>
      </div>
      <h2 className="text-4xl font-serif font-bold text-brand-navy mb-4">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">Thank you for your order. Your custom masterpiece is being processed.</p>
      
      <div className="max-w-xl mx-auto bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-100 mb-8">
          <p className="font-bold text-xl text-brand-navy mb-2">📢 Final Step: Confirm Your Order</p>
          <p className="text-sm text-gray-600 mb-6">To ensure your order is processed immediately, please send the order details to us directly.</p>
          
          <div className="space-y-4">
              <a href={whatsappLink} target="_blank" className="block w-full bg-green-500 text-white py-4 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-3 shadow-lg transform hover:-translate-y-1">
                  <i className="fab fa-whatsapp text-2xl"></i> 
                  <span className="text-lg">Send Details to WhatsApp (Fastest)</span>
              </a>
              <a href={mailtoLink} className="block w-full bg-blue-500 text-white py-4 rounded-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-3 shadow-md">
                  <i className="fas fa-envelope text-xl"></i> 
                  <span>Send Details via Email</span>
              </a>
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">*Clicking these buttons will open your app with all order details pre-filled for you.*</p>
      </div>

      <button onClick={() => setView('home')} className="text-brand-navy font-bold hover:underline">Continue Shopping</button>
    </div>
  );
}

function ScanPayView() {
    return (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Scan & Pay</h2>
                
                <div className="bg-gray-50 p-4 rounded-xl inline-block mb-6 border border-gray-200">
                    <img src={UPI_QR_IMAGE} alt="Scan to Pay" className="w-48 h-48 object-contain mix-blend-multiply" />
                </div>
                
                <p className="font-mono text-sm bg-gray-100 py-2 px-4 rounded mb-6 select-all">{UPI_ID}</p>
                
                <div className="flex justify-center gap-4 mb-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" className="h-6 opacity-60" alt="GPay" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" className="h-6 opacity-60" alt="PhonePe" />
                </div>

                <a 
                    href={UPI_PAYMENT_LINK}
                    className="block w-full bg-brand-navy text-white font-bold py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all transform active:scale-95"
                >
                    Pay via UPI App
                </a>
            </div>
            <p className="mt-8 text-gray-500 text-sm max-w-md text-center">
                Secure payments powered by UPI. Accepted on Google Pay, PhonePe, Paytm, and all major banking apps.
            </p>
        </div>
    )
}

function AdminDashboard({ orders, setView }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold text-brand-navy">Admin Dashboard</h2>
        <button onClick={() => setView('home')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Exit Admin</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs font-mono">{order.id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.customer.firstName} {order.customer.lastName}</div>
                  <div className="text-xs text-gray-500">{order.customer.email}</div>
                </td>
                <td className="p-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="text-sm">
                     {order.items.map((i: any, idx: number) => (
                         <div key={idx}>{i.productName} ({i.size}) x{i.quantity}</div>
                     ))}
                  </div>
                </td>
                <td className="p-4 font-bold">${order.total.toFixed(2)}</td>
                <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs uppercase font-bold">{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([
      { id: 1, productId: 1, userName: "Sarah J.", rating: 5, comment: "Absolutely stunning print quality!", date: "2023-10-15" },
      { id: 2, productId: 1, userName: "Mike T.", rating: 4, comment: "Great service, fast shipping.", date: "2023-10-18" }
  ]);
  const [isChristmasMode, setIsChristmasMode] = useState(true);

  // Persistence
  useEffect(() => {
    const savedOrders = localStorage.getItem('shreeji_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedReviews = localStorage.getItem('shreeji_reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  useEffect(() => {
    localStorage.setItem('shreeji_orders', JSON.stringify(orders));
    localStorage.setItem('shreeji_reviews', JSON.stringify(reviews));
  }, [orders, reviews]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const updateCartQuantity = (id: string | number, change: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  };

  const removeCartItem = (id: string | number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const placeOrder = (customer: CustomerInfo, total: number, paymentMethod: string, orderId: number) => {
    const newOrder = {
      id: orderId,
      customer,
      items: cart,
      total,
      paymentMethod,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setLastOrder(newOrder);
    setView('order-success');
  };
  
  const handleAddReview = (review: Review) => {
      setReviews([review, ...reviews]);
  };

  // Views Logic
  const renderView = () => {
    switch(view) {
      case 'home':
        return (
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
               <div className="bg-white p-4 rounded-xl shadow-sm sticky top-24">
                  <h3 className="font-serif font-bold text-xl mb-4 text-brand-navy border-b pb-2">Categories</h3>
                  <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                          <div key={cat.id}>
                              <button onClick={() => setView(cat.id === 'canvas' ? 'shop-canvas' : cat.id === 'gifts' ? 'shop-gifts' : 'home')} className="font-bold text-brand-navy hover:text-brand-gold w-full text-left py-1 flex justify-between items-center group">
                                  {cat.name}
                                  <i className="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition"></i>
                              </button>
                              <div className="pl-3 mt-1 space-y-1 border-l-2 border-gray-100 ml-1">
                                  {PRODUCTS.filter(p => p.category === cat.id).map(p => p.subCategory).filter((v, i, a) => a.indexOf(v) === i).map(sub => (
                                      <button 
                                        key={sub} 
                                        onClick={() => {
                                            // Quick hack to filter shop view
                                            setView(cat.id === 'canvas' ? 'shop-canvas' : 'shop-gifts');
                                        }}
                                        className="block text-sm text-gray-500 hover:text-brand-navy w-full text-left py-0.5"
                                      >
                                          {SUBCATEGORY_LABELS[sub] || sub}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
               <HeroBanner isChristmasMode={isChristmasMode} setView={setView} />
               
               {isChristmasMode && (
                   <div className="mb-12 bg-red-50 p-6 rounded-2xl border border-red-100">
                       <div className="flex items-center gap-3 mb-6">
                           <span className="text-3xl">🎁</span>
                           <h2 className="text-2xl font-serif font-bold text-brand-navy">Christmas Bundles</h2>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {CHRISTMAS_BUNDLES.map(bundle => (
                               <div key={bundle.id} onClick={() => {
                                   setProduct({ ...PRODUCTS[0], name: bundle.name, basePrice: bundle.price, features: bundle.items });
                                   setView('design');
                               }} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition cursor-pointer group">
                                   <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                                       <img src={bundle.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                       <div className="absolute top-2 right-2 bg-brand-christmasRed text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">SAVE 40%</div>
                                   </div>
                                   <h3 className="font-bold text-brand-navy mb-1">{bundle.name}</h3>
                                   <div className="flex items-center gap-2">
                                       <span className="text-lg font-bold text-brand-gold">${bundle.price}</span>
                                       <span className="text-sm text-gray-400 line-through">${bundle.originalPrice}</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               <div className="mb-8">
                   <h2 className="text-2xl font-serif font-bold mb-6 text-brand-navy">Canvas & Wall Art</h2>
                   <ProductGrid products={PRODUCTS.filter(p => p.category === 'canvas').slice(0, 4)} setProduct={(p: Product) => { setProduct(p); setView('design'); }} isChristmasMode={isChristmasMode} />
               </div>

               <div className="mb-8">
                   <h2 className="text-2xl font-serif font-bold mb-6 text-brand-navy">Personalized Gifts</h2>
                   <ProductGrid products={PRODUCTS.filter(p => p.category === 'gifts').slice(0, 4)} setProduct={(p: Product) => { setProduct(p); setView('design'); }} isChristmasMode={isChristmasMode} />
               </div>
            </div>
          </div>
        );
      case 'shop-canvas':
        return (
          <div className="container mx-auto px-4 py-8">
              <h2 className="text-3xl font-serif font-bold mb-8 text-brand-navy">Canvas Collection</h2>
              <ProductGrid products={PRODUCTS.filter(p => p.category === 'canvas')} setProduct={(p: Product) => { setProduct(p); setView('design'); }} isChristmasMode={isChristmasMode} />
          </div>
        );
      case 'shop-gifts':
        return (
           <div className="container mx-auto px-4 py-8">
              <h2 className="text-3xl font-serif font-bold mb-8 text-brand-navy">Personalized Gifts</h2>
              <ProductGrid products={PRODUCTS.filter(p => p.category === 'gifts')} setProduct={(p: Product) => { setProduct(p); setView('design'); }} isChristmasMode={isChristmasMode} />
          </div>
        );
      case 'occasions':
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gifts for Every Occasion</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['Birthday', 'Anniversary', 'Wedding', 'Housewarming', 'Baby Shower', 'Love'].map(occ => (
                        <div key={occ} onClick={() => setView('shop-gifts')} className="relative h-64 rounded-xl overflow-hidden cursor-pointer group shadow-lg">
                            <img src={UNIVERSAL_PRODUCT_IMAGE} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 filter brightness-75 group-hover:brightness-100" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-serif font-bold text-white drop-shadow-md">{occ}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
      case 'design':
        return product ? (
             <DesignView 
                product={product} 
                onAddToCart={addToCart} 
                setView={setView} 
                isChristmasMode={isChristmasMode}
                allProducts={PRODUCTS}
                setProduct={setProduct}
                onAddReview={handleAddReview}
                reviews={reviews}
             />
        ) : null;
      case 'cart':
        return <CartView cart={cart} updateQuantity={updateCartQuantity} removeCartItem={removeCartItem} setView={setView} />;
      case 'checkout':
        return <CheckoutView cart={cart} onPlaceOrder={placeOrder} setView={setView} isChristmasMode={isChristmasMode} />;
      case 'order-success':
        return <OrderSuccessView lastOrder={lastOrder} setView={setView} />;
      case 'scan-pay':
        return <ScanPayView />;
      case 'admin':
        return <AdminDashboard orders={orders} setView={setView} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isChristmasMode ? 'bg-[url("https://www.transparenttextures.com/patterns/snow.png")]' : ''}`}>
      {isChristmasMode && <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden"><div className="snowflake">❅</div><div className="snowflake" style={{animationDelay: '2s', left: '20%'}}>❆</div><div className="snowflake" style={{animationDelay: '4s', left: '40%'}}>❅</div><div className="snowflake" style={{animationDelay: '1s', left: '60%'}}>❆</div><div className="snowflake" style={{animationDelay: '3s', left: '80%'}}>❅</div></div>}
      
      <Header setView={setView} cartCount={cart.length} isChristmasMode={isChristmasMode} toggleChristmasMode={() => setIsChristmasMode(!isChristmasMode)} />
      
      <main className="flex-1">
         {renderView()}
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-2xl font-serif font-bold mb-4">Shreeji Decor</h4>
            <p className="text-gray-400 text-sm">Premium custom decor studio delivering happiness through personalized art.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-brand-gold">Contact</h4>
            <p className="text-gray-400 text-sm mb-2"><i className="fas fa-map-marker-alt mr-2"></i> Kalol, Gujarat</p>
            <p className="text-gray-400 text-sm mb-2"><i className="fas fa-phone mr-2"></i> +91 91060 38302</p>
            <p className="text-gray-400 text-sm mb-2"><i className="fas fa-envelope mr-2"></i> canvasmaster7@gmail.com</p>
            <a href="https://www.instagram.com/sofabydad" target="_blank" className="block text-gray-400 text-sm mb-2 hover:text-white cursor-pointer"><i className="fab fa-instagram mr-2"></i> @sofabydad</a>
            <p onClick={() => setView('scan-pay')} className="text-brand-gold cursor-pointer hover:underline mt-2"><i className="fas fa-qrcode mr-2"></i> Scan & Pay</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-brand-gold">Shop</h4>
            <ul className="text-sm text-gray-400 space-y-2">
               <li><button onClick={() => setView('shop-canvas')}>Canvas Prints</button></li>
               <li><button onClick={() => setView('shop-gifts')}>Photo Gifts</button></li>
               <li><button onClick={() => setView('occasions')}>Occasions</button></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold mb-4 text-brand-gold">Admin</h4>
             <button onClick={() => setView('admin')} className="text-gray-500 text-xs hover:text-white">Admin Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
);