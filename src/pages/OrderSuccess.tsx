import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, PackageCheck, Truck, CreditCard, ArrowRight, ShoppingBag, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderItem {
  productId?: string;
  id?: string;
  productName?: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
  subtotal?: number;
}

interface OrderDetails {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  zipCode?: string;
  payment_method?: 'link' | 'cod';
  paymentMethod?: 'link' | 'cod';
  subtotal: number;
  shipping_cost?: number;
  shippingCost?: number;
  total_amount?: number;
  total?: number;
  items: OrderItem[];
  created_at?: string;
  createdAt?: string;
  status?: string;
}

export function OrderSuccess() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<OrderDetails | null>(
    (location.state as { order?: OrderDetails })?.order || null
  );
  const [isLoading, setIsLoading] = useState(!order && !!orderId);

  useEffect(() => {
    async function fetchOrder() {
      if (!order && orderId) {
        setIsLoading(true);
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase timed out')), 2500)
          );
          const queryPromise = supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          const result = (await Promise.race([queryPromise, timeoutPromise])) as {
            data: any;
            error: any;
          };

          if (!result.error && result.data) {
            setOrder(result.data);
            return;
          }
        } catch (e) {
          console.warn('Supabase query error or timeout, checking local storage:', e);
        }

        try {
          const localOrders = JSON.parse(localStorage.getItem('bruster_orders') || '[]');
          const found = localOrders.find((o: any) => String(o.id) === String(orderId));
          if (found) {
            setOrder(found);
          }
        } catch (storageErr) {
          console.warn('Could not read from localStorage:', storageErr);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchOrder();
  }, [order, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-600 font-medium">Loading your order details...</p>
      </div>
    );
  }

  const clientName = order?.first_name 
    ? `${order.first_name} ${order.last_name || ''}`.trim()
    : order?.firstName 
    ? `${order.firstName} ${order.lastName || ''}`.trim() 
    : 'Valued Customer';

  const emailAddress = order?.email || 'your email address';
  const phone = order?.phone || '';
  const address = order?.address || '';
  const city = order?.city || '';
  const state = order?.state || '';
  const zipCode = order?.zip_code || order?.zipCode || '';
  const paymentMethod = order?.payment_method || order?.paymentMethod || 'cod';
  const subtotal = order?.subtotal ?? 0;
  const shippingCost = order?.shipping_cost ?? order?.shippingCost ?? 0;
  const totalAmount = order?.total_amount ?? order?.total ?? (subtotal + shippingCost);
  const items = order?.items || [];
  const displayId = order?.id || orderId || Math.floor(100000 + Math.random() * 900000);
  const orderDate = order?.created_at || order?.createdAt || new Date().toISOString();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      {/* Order Confirmation Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg shadow-black/5"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#39FF14]/20 text-[#39FF14] mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-4">
          WE HAVE RECEIVED YOUR ORDER
        </h1>

        <p className="text-zinc-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6">
          Thank you for your purchase, <strong className="text-black">{clientName}</strong>. We have received your order and send a confirmation to <strong className="text-[#B91C1C]">{emailAddress}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-mono text-zinc-600 mb-8">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Order #{displayId}</span>
          <span className="text-zinc-300">•</span>
          <span>{new Date(orderDate).toLocaleDateString()} {new Date(orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Order Details Summary */}
        <div className="bg-zinc-50 rounded-xl p-6 text-left mb-8 border border-zinc-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
            <h2 className="text-sm font-black uppercase text-black">Ordered Products</h2>
            <span className="text-xs font-bold text-zinc-500 uppercase">{paymentMethod === 'cod' ? 'Pay on Delivery' : 'Paid'}</span>
          </div>

          {items.length > 0 ? (
            <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1 custom-scrollbar divide-y divide-zinc-200/60">
              {items.map((item, idx) => {
                const name = item.productName || item.name || 'Product';
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
              <span>{subtotal} ALL</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <strong className="text-[#39FF14]">FREE</strong> : `${shippingCost} ALL`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-black pt-2 border-t border-zinc-200">
              <span>Total Amount</span>
              <span className="text-[#39FF14]">{totalAmount} ALL</span>
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
