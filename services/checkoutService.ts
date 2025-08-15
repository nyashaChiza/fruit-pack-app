import api from "./api";
import { getToken } from "./authServices";
import { CartItem } from '../types';
import  { Router }  from 'expo-router/build/hooks';
import { showToast } from "services/toastService";


type Prop = {
  email: string;
  address: string;
  phone: string;
  selectedMethod: 'cash' | 'card' | '';
  latitude: number | null;
  longitude: number | null;
  cartItems: CartItem[];
  clearCart: () => void;
  router: Router;
};
export const placeOrders = async ({
  email,
  address,
  phone,
  selectedMethod,
  latitude,
  longitude,
  cartItems,
  clearCart,
  navigateToCheckout: (url: string) => {
        navigation.navigate('PaystackCheckout', { url });
      },

}: Prop) => {
  if (!name || !address || !phone || !selectedMethod) {
    showToast('error', 'Validation Error', 'Please fill in all required fields.');
    return;
  }

  if (latitude == null || longitude == null) {
    showToast('error', 'Location Error', 'Please select a valid delivery location.');
    return;
  }

  try {
    const token = await getToken();
    if (!token) {
      showToast('error', 'Unauthorized', 'Please log in to place an order.');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const payload = {
      email,
      address,
      latitude,
      longitude,
      phone,
      payment_method: selectedMethod,
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const response = await api.post('cart/checkout/', payload);

    if (selectedMethod === 'card') {
      const { payment_url } = response.data;

      if (!payment_url) {
        throw new Error('Payment URL not received.');
      }

      // Navigate to Paystack WebView screen
      router.push({
        pathname: '/paystack-checkout',
        params: { url: payment_url },
      });
    } else {
      showToast('success', 'Order Placed', 'Your order has been placed successfully.');
      clearCart();
    }
  } catch (err: any) {
    showToast('error', 'Checkout Error', err.response?.data?.detail || 'Failed to place order.');
  }
};