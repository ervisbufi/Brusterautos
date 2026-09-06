import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://zqvlgazrujfojimumvra.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_QJTq228E1dvBiEODZuobXw_CxuTkQmw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface OrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'link' | 'cod';
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    subtotal: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}

function saveLocalOrder(order: OrderPayload) {
  const localId = Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();
  const record = {
    id: localId,
    first_name: order.firstName,
    last_name: order.lastName,
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    zip_code: order.zipCode,
    zipCode: order.zipCode,
    payment_method: order.paymentMethod,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping_cost: order.shippingCost,
    shippingCost: order.shippingCost,
    total_amount: order.total,
    total: order.total,
    items: order.items,
    status: 'pending',
    created_at: now,
    createdAt: now,
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bruster_orders') || '[]');
      existing.unshift(record);
      localStorage.setItem('bruster_orders', JSON.stringify(existing));
    }
  } catch (err) {
    console.warn('Could not persist order to localStorage:', err);
  }

  return [record];
}

export async function createOrder(order: OrderPayload) {
  const orderRecord = {
    first_name: order.firstName,
    last_name: order.lastName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    zip_code: order.zipCode,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    shipping_cost: order.shippingCost,
    total_amount: order.total,
    items: order.items,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  // Set a 3-second timeout for Supabase requests
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Supabase request timed out')), 3000)
  );

  try {
    const insertPromise = supabase
      .from('orders')
      .insert([orderRecord])
      .select();

    const { data, error } = (await Promise.race([insertPromise, timeoutPromise])) as {
      data: any;
      error: any;
    };

    if (error) {
      console.warn('[AI Studio] Supabase order insertion failed, falling back to local order storage:', error);
      return saveLocalOrder(order);
    }

    return data;
  } catch (err) {
    console.warn('[AI Studio] Supabase unreachable or timed out, saving order locally:', err);
    return saveLocalOrder(order);
  }
}
