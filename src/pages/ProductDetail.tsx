import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = useMemo(() => PRODUCTS.find(p => p.id === id), [id]);

  if (!product) {
    return (
      <div className="flex-grow flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-black">Product not found</h2>
        <Link to="/" className="text-[#B91C1C] hover:text-[#B91C1C]/80 underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
      
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative"
          >
            <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/111/333?text=Product+Image" }} 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl font-black italic uppercase text-black mb-4 tracking-tighter">
              {product.name}
            </h1>
            
            <div className="text-3xl font-black text-black mb-6">
              {product.price} ALL
            </div>
            
            <p className="text-lg text-zinc-600 mb-10 leading-relaxed">
              {product.description}
            </p>
            
            <div className="space-y-4 mb-10 text-sm text-zinc-600">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#39FF14]" /> 
                <span>In Stock & Ready to Ship</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-12 flex items-center justify-between border border-zinc-200 rounded-lg bg-zinc-50 px-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black transition-colors cursor-pointer text-base font-bold rounded hover:bg-zinc-200/60"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-black text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black transition-colors cursor-pointer text-base font-bold rounded hover:bg-zinc-200/60"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 h-12 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[darkred] hover:bg-[#700000] text-white shadow-md shadow-red-950/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isAdded ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
