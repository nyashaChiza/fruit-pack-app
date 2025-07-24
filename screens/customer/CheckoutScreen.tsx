import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCart';
import { placeOrder } from '../../services/checkoutService';
import  MapSelector  from '../../components/common/MapSelector';

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | ''>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const { cartItems, clearCart } = useCart();
  const stripe = useStripe();
  const router = useRouter();

  const handleCheckout = async () => {
    await placeOrder({
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
    });
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-xl font-bold text-center mb-4">Checkout</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
      />

      <Text className="mb-2 font-semibold">Select Payment Method:</Text>
      <View className="flex-row justify-between mb-4">
        {['cash', 'card'].map(method => (
          <TouchableOpacity
            key={method}
            onPress={() => setSelectedMethod(method as 'cash' | 'card')}
            className={`flex-1 mx-1 p-3 rounded-lg border ${
              selectedMethod === method
                ? 'bg-green-600 border-green-700'
                : 'border-gray-300'
            }`}
          >
            <Text className="text-center text-white font-semibold capitalize">
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <MapSelector
        latitude={latitude}
        longitude={longitude}
        onLocationSelect={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />

      <TouchableOpacity
        onPress={handleCheckout}
        className="mt-6 bg-green-600 p-4 rounded-lg"
      >
        <Text className="text-white font-bold text-center text-lg">Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}
