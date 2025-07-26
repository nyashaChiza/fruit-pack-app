import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../hooks/useCart';
import { placeOrder } from '../../services/checkoutService';
import BottomNavigation from "../../components/common/BottomNavigation";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | ''>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigation = useNavigation();
  const stripe = useStripe();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cart, clearCart } = useCart();

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
      Alert.alert('Permission denied', 'Location access is required.');
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setLocation({ latitude, longitude });
    setLatitude(latitude);
    setLongitude(longitude);
    Alert.alert('Location Set', 'Your current location has been set.');
  };

  const handleCheckout = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Location Required', 'Please select a delivery location.');
      return;
    }

    await placeOrder({
      name,
      address,
      phone,
      selectedMethod,
      latitude,
      longitude,
      cartItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_name: item.image_name,
      })),
      stripe,
      clearCart,
      router,
    });
   navigation.navigate('OrderList');
  };
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-green-50">
  <ScrollView className="px-4 pt-6 pb-36">
    <Text className="text-2xl font-bold text-center mb-6 text-gray-900">Checkout</Text>

    {/* 🚚 Delivery Info */}
    <View className="bg-white rounded-xl p-4 shadow mb-6">
      <View className="flex-row items-center mb-4">
        <MaterialIcons name="person" size={20} color="gray" />
        <Text className="text-lg font-semibold text-gray-800 ml-2">Delivery Info</Text>
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center">
          <Feather name="user" size={16} color="gray" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="flex-1 border border-gray-300 rounded-md px-4 py-3 my-2 bg-white"
          />
        </View>
        <View className="flex-row items-center">
          <Feather name="map-pin" size={16} color="gray" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            className="flex-1 border border-gray-300 rounded-md px-4 py-3 my-2 bg-white"
          />
        </View>
        <View className="flex-row items-center">
          <Feather name="phone" size={16} color="gray" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Phone Number"
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
            className={`flex-1 mx-1 py-3 rounded-md border ${
              selectedMethod === method
                ? 'bg-green-600 border-green-700'
                : 'border-gray-300 bg-gray-100'
            }`}
          >
            <Text
              className={`text-center font-medium capitalize ${
                selectedMethod === method ? 'text-white' : 'text-gray-700'
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

      <TouchableOpacity onPress={handleCurrentLocation} className="bg-blue-600 p-3 rounded-md mb-3 flex-row justify-center">
        <Feather name="navigation" size={16} color="white" style={{ marginRight: 6 }} />
        <Text className="text-white text-center font-medium">Use Current Location</Text>
      </TouchableOpacity>

      <View className="h-64 w-full rounded-lg overflow-hidden">
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: location?.latitude ?? -20.165,
            longitude: location?.longitude ?? 57.503,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={(e) => {
            const coords = e.nativeEvent.coordinate;
            setLocation(coords);
            setLatitude(coords.latitude);
            setLongitude(coords.longitude);
          }}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Delivery Location"
              description="Your selected delivery point"
              pinColor="green"
            />
          )}
        </MapView>
      </View>
    </View>

    {/* 📦 Order Summary */}
    <View className="bg-white rounded-xl p-4 shadow mb-6 my-4">
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
        className="bg-green-600 p-4 rounded-xl shadow-md py-4 flex-row justify-center items-center"
      >
        <Feather name="check-circle" size={18} color="white" style={{ marginRight: 6 }} />
        <Text className="text-white font-bold text-lg">Place Order</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>

  {/* Bottom Navigation Stub */}
  <BottomNavigation />
</SafeAreaView>

  );
}