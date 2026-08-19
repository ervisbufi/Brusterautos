import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zqvlgazrujfojimumvra.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QJTq228E1dvBiEODZuobXw_CxuTkQmw';

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

export async function createOrder(order: OrderPayload) {
  // Format data for standard Supabase SQL tables
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

  // Attempt to insert into "orders" table
  const { data, error } = await supabase
    .from('orders')
    .insert([orderRecord])
    .select();

  if (error) {
    console.error('Supabase order creation error:', error);
    // If standard snake_case fails due to camelCase columns, try fallback
    const camelCaseRecord = {
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state,
      zipCode: order.zipCode,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      items: order.items,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const retryRes = await supabase
      .from('orders')
      .insert([camelCaseRecord])
      .select();

    if (retryRes.error) {
      console.warn('Fallback insertion also failed:', retryRes.error);
      throw error;
    }
    return retryRes.data;
  }

  return data;
}
