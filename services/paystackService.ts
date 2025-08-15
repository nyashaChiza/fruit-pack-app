import api from './api';
import { getToken } from './authServices';
import { CartItem } from '../types';
import { NavigationProp } from '@react-navigation/native';
import { showToast } from 'services/toastService';


type Prop = {
  email: string;
  address: string;
  phone: string;
  selectedMethod: 'cash' | 'card' | '';
  latitude: number | null;
  longitude: number | null;
  cartItems: CartItem[];
  clearCart: () => void;

};

export const placeOrder = async ({
  email,
  address,
  phone,
  selectedMethod,
  latitude,
  longitude,
  cartItems,
  clearCart,
}: Prop) => {
  if (!email || !address || !phone || !selectedMethod) {
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
    return response.data;

    if (selectedMethod === 'card') {
      if (!payment_url) {
        showToast('error', 'Payment Error', 'No payment URL received.');
        return;
      }
      navigation.navigate('PaystackCheckout', { url: payment_url });
      

    } else {
      showToast('success', 'Order Placed', 'Your cash order has been placed successfully.');
      clearCart();
      navigation.navigate('OrderList');
    }
  } catch (error: any) {
    console.error('Order placement error:', error);
    showToast('error', 'Order Failed', error?.response?.data?.message || 'Something went wrong.');
  }
};

