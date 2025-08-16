import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCart } from '../../hooks/useCart';
import { placeOrder } from '../../services/paystackService';
import BottomNavigation from "../../components/common/BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import { showToast } from '../../services/toastService';
import { useLocalSearchParams } from 'expo-router/build/hooks';



export default function CheckoutScreen() {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | ''>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { cart, clearCart } = useCart();
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    // Simple but effective email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (params?.lat && params?.lng) {
      const lat = Number(params.lat);
      const lng = Number(params.lng);
      setLatitude(lat);
      setLongitude(lng);
      setLocation({ latitude: lat, longitude: lng });
    }
  }, [params]);

  const handleCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showToast('error', 'Permission Denied', 'Location permission is required to use current location.');
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setLocation({ latitude, longitude });
    setLatitude(latitude);
    setLongitude(longitude);
    showToast('success', 'Location Set', 'Your current location has been set.');

  };

  const handleCheckout = async () => {
    if (!email || !address || !phone || !selectedMethod) {
      showToast(
        'error',
        'Incomplete Details',
        'Please complete all fields: email, address, phone number, and delivery method.'
      );
      return;
    }

    if (!latitude || !longitude) {
      showToast('error', 'Location Required', 'Please select your delivery location on the map.');
      return;
    }

    try {
      const { payment_url } = await placeOrder({
        email,
        address,
        phone,
        selectedMethod,
        latitude,
        longitude,
        cartItems: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        clearCart // ✅ only if backend supports safe clearing
      });
      clearCart();
      if (selectedMethod === 'card' && payment_url) {
        navigation.navigate('PaystackCheckout', { url: payment_url });
      } else {
        navigation.navigate('OrderList');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('error', 'Order Failed', 'Something went wrong while placing your order.');
    }
  };
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView className="px-4 pt-6 pb-36">
        <Text className="text-2xl font-bold text-center mb-6 text-green-800">
          <Feather name="shopping-cart" size={22} color="green" /> Checkout
        </Text>

        {/* 🚚 Delivery Info */}
        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="person" size={20} color="gray" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Delivery Info</Text>
          </View>

          <View className="space-y-3">
            <View className="mb-4">
              <View className="flex-row items-center">
                <Feather name="user" size={16} color="gray" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    validateEmail(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`flex-1 border rounded-md px-4 py-3 bg-white ${error ? "border-red-500" : "border-gray-300"}`}
                />
              </View>

              {/* Error message below input */}
              {error ? <Text className="text-red-500 text-sm mt-1 ml-6">{error}</Text> : null}
            </View>


            <View className="flex-row items-center">
              <Feather name="map-pin" size={16} color="gray" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Address"
                placeholderTextColor="#9CA3AF"
                value={address}
                onChangeText={setAddress}
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 my-2 bg-white"
              />
            </View>
            <View className="flex-row items-center">
              <Feather name="phone" size={16} color="gray" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 my-2 bg-white"
              />
            </View>
          </View>

          {/* 💳 Payment Method */}
          <Text className="font-semibold text-gray-700 mt-5 mb-2">Payment Method</Text>
          <View className="flex-row justify-between">
            {['cash', 'card'].map(method => (
              <TouchableOpacity
                key={method}
                onPress={() => setSelectedMethod(method as 'cash' | 'card')}
                className={`flex-1 mx-1 py-3 rounded-md border ${selectedMethod === method
                  ? 'bg-green-600 border-green-700'
                  : 'border-gray-300 bg-gray-100'
                  }`}
              >
                <Text
                  className={`text-center font-medium capitalize ${selectedMethod === method ? 'text-white' : 'text-gray-700'
                    }`}
                >
                  {method === 'card' ? '💳' : '💵'} {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🗺️ Delivery Location */}
        <View className="bg-white rounded-xl p-4 shadow mb-6">
          <View className="flex-row items-center mb-3">
            <Feather name="map" size={18} color="gray" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Delivery Location</Text>
          </View>

          <TouchableOpacity onPress={handleCurrentLocation} className="bg-green-600 p-3 rounded-md mb-3 flex-row justify-center">
            <Feather name="navigation" size={16} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white text-center font-medium">Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* 📦 Order Summary */}
        <View className="bg-white rounded-xl p-4 shadow mb-6 my-4 mb-16">
          <View className="flex-row items-center mb-3">
            <Feather name="list" size={18} color="gray" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Order Summary</Text>
          </View>

          {cart.map(item => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text className="text-gray-700">
                <MaterialIcons name="local-grocery-store" size={16} color="gray" /> {item.name} x {item.quantity}
              </Text>
              <Text className="text-gray-700">R{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-gray-200 mt-3 pt-3 flex-row justify-between mb-4">
            <Text className="font-bold text-gray-900">Total:</Text>
            <Text className="font-bold text-gray-900">R{cartTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-green-600 p-4 rounded-xl shadow-md py-4 flex-row justify-center items-center "
          >
            <Feather name="check-circle" size={18} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-bold text-lg">Place Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="pb-16" />
      {/* Bottom Navigation Stub */}
      <BottomNavigation />
    </SafeAreaView>

  );
}