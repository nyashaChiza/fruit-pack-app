import { Alert } from 'react-native';
import { Stripe, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import api from "./api";
import { getToken } from "./authServices";
import { CartItem } from '../types';
import { Router } from 'expo-router/build/hooks';

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
    Alert.alert('Missing Info', 'Please fill in all fields and select a payment method.');
    return;
  }

  if (latitude == null || longitude == null) {
    Alert.alert('Location Required', 'Please select your delivery location on the map.');
    return;
  }

  try {
    const token = await getToken();
    if (!token) {
      Alert.alert('Unauthorized', 'Please log in first.');
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
        returnURL: 'fruitpack://OrderListScreen',
      });

      if (initError) throw new Error(initError.message);

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Payment Failed', paymentError.message);
        return;
      }

      Alert.alert('✅ Payment Successful', `Order ID: ${order_id}`);
    } else {
      Alert.alert('✅ Order Created', `Order ID: ${order_id}`);
    }

    clearCart();
    router.replace('/screens/orders');
  } catch (err: any) {
    console.error('Checkout error:', err.response?.data || err.message);
    Alert.alert('❌ Error', err.response?.data?.detail || 'Something went wrong.');
  }
};


