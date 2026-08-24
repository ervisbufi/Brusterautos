import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, AlertCircle, CheckCircle2, ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { createOrder, OrderPayload } from '../lib/supabase';

interface OrderItemPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

interface SubmittedOrder {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  zip_code?: string;
  paymentMethod?: string;
  payment_method?: string;
  items: OrderItemPayload[];
  subtotal: number;
  shippingCost?: number;
  shipping_cost?: number;
  total?: number;
  total_amount?: number;
  created_at?: string;
}

export function Checkout() {
  const { cart, cartTotal, cartCount, shippingCost, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<'link' | 'cod'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<SubmittedOrder | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const total = finalTotal;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const orderPayload: OrderPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        subtotal: item.product.price * item.quantity
      })),
      subtotal: cartTotal,
      shippingCost,
      total: finalTotal,
    };

    try {
      const response = await createOrder(orderPayload);
      const createdRecord: SubmittedOrder = (response && Array.isArray(response) && response[0]) ? response[0] : {
        ...orderPayload,
        id: Math.floor(100000 + Math.random() * 900000),
        created_at: new Date().toISOString()
      };
      
      clearCart();
      setConfirmedOrder(createdRecord);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (err: unknown) {
      console.error('Failed to submit order to Supabase:', err);
      const errObj = err as { message?: string };
      setErrorMessage(
        errObj.message || 'There was an issue saving your order to Supabase. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !isSubmitting && !confirmedOrder) {
      navigate('/cart');
    }
  }, [cart.length, isSubmitting, confirmedOrder, navigate]);

  useEffect(() => {
    if (confirmedOrder) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [confirmedOrder]);

  // If order is confirmed, display ONLY the confirmation section
  if (confirmedOrder) {
    const clientName = `${confirmedOrder.firstName || confirmedOrder.first_name || ''} ${confirmedOrder.lastName || confirmedOrder.last_name || ''}`.trim();
    const emailAddress = confirmedOrder.email || '';
    const displayId = confirmedOrder.id || Math.floor(100000 + Math.random() * 900000);
    const orderDate = confirmedOrder.created_at || new Date().toISOString();
    const confirmedItems = confirmedOrder.items || [];
    const confirmedSubtotal = confirmedOrder.subtotal ?? 0;
    const confirmedShipping = confirmedOrder.shippingCost ?? confirmedOrder.shipping_cost ?? 0;
    const confirmedTotal = confirmedOrder.total ?? confirmedOrder.total_amount ?? (confirmedSubtotal + confirmedShipping);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          id="order-received-section"
          className="bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 text-center shadow-xl shadow-black/5"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#39FF14]/20 text-[#39FF14] mb-6 shadow-md shadow-[#39FF14]/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-4">
            WE HAVE RECEIVED YOUR ORDER
          </h1>

          <p className="text-zinc-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6">
            Thank you for your purchase, <strong className="text-black">{clientName || 'Valued Customer'}</strong>. We have received your order and send a confirmation to <strong className="text-[#B91C1C]">{emailAddress}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-mono text-zinc-600 mb-8">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Order #{displayId}</span>
            <span className="text-zinc-300">•</span>
            <span>{new Date(orderDate).toLocaleDateString()} {new Date(orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Ordered Products breakdown */}
          <div className="bg-zinc-50 rounded-xl p-6 text-left mb-8 border border-zinc-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <h2 className="text-sm font-black uppercase text-black">Ordered Products</h2>
              <span className="text-xs font-bold text-zinc-500 uppercase">Pay on Delivery</span>
            </div>

            {confirmedItems.length > 0 ? (
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1 custom-scrollbar divide-y divide-zinc-200/60">
                {confirmedItems.map((item, idx) => {
                  const name = item.productName || 'Product';
                  const price = item.price || 0;
                  const qty = item.quantity || 1;
                  const itemTotal = item.subtotal || price * qty;
                  const image = item.image;

                  return (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {image && (
                          <div className="w-12 h-12 bg-white rounded border border-zinc-200 overflow-hidden shrink-0">
                            <img 
                              src={image} 
                              alt={name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/111/333?text=Part"; }}
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black truncate max-w-[200px] sm:max-w-xs">{name}</p>
                          <p className="text-xs text-zinc-500">Qty: {qty} × {price} ALL</p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-black shrink-0">{itemTotal} ALL</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-2">Items successfully recorded in your order.</p>
            )}

            <div className="border-t border-zinc-200 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>{confirmedSubtotal} ALL</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>{confirmedShipping === 0 ? <strong className="text-[#39FF14]">FREE</strong> : `${confirmedShipping} ALL`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-[#39FF14]">{confirmedTotal} ALL</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#B91C1C] hover:bg-[#991b1b] text-white px-10 py-4 rounded font-black uppercase text-sm tracking-wider transition-colors shadow-lg shadow-[#B91C1C]/20 w-full sm:w-auto cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0 && !isSubmitting) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl md:text-4xl font-black text-black uppercase italic mb-8 tracking-tighter">
        Checkout
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact Info */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="text-xl font-black uppercase text-black mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-600 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-600 mb-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="text-xl font-black uppercase text-black mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-600 mb-1">Street Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">State / Province</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">ZIP / Postal Code</label>
                  <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-zinc-50 border border-zinc-300 rounded px-4 py-2.5 text-black focus:outline-none focus:border-[#B91C1C] text-sm" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="text-xl font-black uppercase text-black mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded cursor-pointer transition-colors border-[#B91C1C] bg-[#B91C1C]/5">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <Truck className="w-6 h-6 mr-4 text-[#B91C1C]" />
                  <div className="flex-grow">
                    <div className="font-bold text-black">Pay on Delivery</div>
                    <div className="text-sm text-zinc-600">Pay with cash or card when your order arrives</div>
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-black uppercase text-black mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-100 rounded border border-zinc-200 flex-shrink-0 overflow-hidden relative">
                    <img onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600/111/333?text=Product+Image" }} src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-zinc-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-grow py-1 flex flex-col justify-between">
                    <h4 className="text-sm font-medium text-zinc-700 line-clamp-2">{item.product.name}</h4>
                    <span className="text-sm font-black text-[#39FF14]">{item.product.price * item.quantity} ALL</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-zinc-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Quantity</span>
                <span className="font-semibold text-black">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span>{cartTotal} ALL</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-[#39FF14] font-bold">
                      FREE (0 ALL)
                    </span>
                  ) : (
                    <span>{shippingCost} ALL</span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="border-t border-zinc-200 pt-4 mb-8">
              <div className="flex justify-between items-center text-black text-xl font-black">
                <span>Total</span>
                <span className="text-[#39FF14]">{total} ALL</span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black shadow-lg shadow-[#39FF14]/20 py-4 rounded font-black uppercase text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer tracking-wider"
            >
              {isSubmitting ? 'Submitting Order...' : 'Confirm the Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
