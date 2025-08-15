import { usePaystack } from 'react-native-paystack-webview';
import api from './api';
import { getToken } from './authServices';
import { CartItem } from '../types';
import { Router } from 'expo-router';
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
  router: Router;
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
  router,
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
    const { order_id } = response.data;

    if (selectedMethod === 'card') {
      const { popup } = usePaystack();

      const { error: initError } = await popup.checkout({
        email: email, 
        amount: 10000, // Amount in kobo (₦100.00)
        reference: `ORDER_${order_id}_${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: order_id.toString(),
            },
          ],
        },
        onSuccess: (res) => {
          showToast('success', 'Payment Successful', 'Your payment has been processed successfully.');
          clearCart();
          return;
        },
        onCancel: () => {
          showToast('info', 'Payment Cancelled', 'You have cancelled the payment.');
        },
        onError: (err) => {
          showToast('error', 'Payment Error', err.message || 'An error occurred during payment.');
        },
      });

      if (initError) {
        showToast('error', 'Initialization Error', initError.message || 'Failed to initialize payment.');
      }
    } else {
      showToast('success', 'Order Placed', 'Your order has been placed successfully.');
      clearCart();
      return;
    }
  } catch (err: any) {
    showToast('error', 'Checkout Error', err.response?.data?.detail || 'Failed to place order.');
  }
};
