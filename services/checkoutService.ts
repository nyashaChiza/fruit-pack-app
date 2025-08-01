import { Stripe, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import api from "./api";
import { getToken } from "./authServices";
import { CartItem } from '../types';
import { Router } from 'expo-router/build/hooks';
import { showToast } from "services/toastService";


type Prop = {
  name: string;
  address: string;
  phone: string;
  selectedMethod: 'cash' | 'card' | '';
  latitude: number | null;
  longitude: number | null;
  cartItems: CartItem[];
  stripe: Stripe;
  clearCart: () => void;
  router: Router;
};

export const placeOrder = async ({
  name,
  address,
  phone,
  selectedMethod,
  latitude,
  longitude,
  cartItems,
  stripe,
  clearCart,
  router,
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
      full_name: name,
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
    const { order_id, client_secret } = response.data;

    if (selectedMethod === 'card') {
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: client_secret,
        returnURL: 'fruitpack://OrderList',
      });

      if (initError) throw new Error(initError.message);

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        showToast('error', 'Payment Error', paymentError.message || 'Payment failed.');
        return;
      }

      showToast('success', 'Payment Successful', 'Your payment has been processed successfully.');
    } else {
      showToast('success', 'Order Placed', 'Your order has been placed successfully.');
    }

    clearCart();
  } catch (err: any) {
    showToast('error', 'Checkout Error', err.response?.data?.detail || 'Failed to place order.');
  }
};


