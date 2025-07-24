import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "../../hooks/useCart";
import api from "../../services/api";
import BottomNavigation from "../../components/common/BottomNavigation";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push("/screens/customer/CheckoutScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 220,
        }}
        className="p-4"
      >
        <Text className="text-2xl font-bold mb-4 text-green-900">🛒 Your Cart</Text>

        {cart.length === 0 ? (
          <Text className="text-gray-500 text-center mt-20">Your cart is empty.</Text>
        ) : (
          cart.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 mb-4 flex-row"
            >
              <Image
                source={{
                  uri: `${api.defaults.baseURL}products/images/${item.image_name}`,
                }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-lg font-semibold text-green-900">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-green-700">R{item.price.toFixed(2)}</Text>
                </View>

                <View className="flex-row items-center mt-2">
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                    }
                    className="bg-green-200 px-2 rounded"
                  >
                    <Text className="text-lg">−</Text>
                  </TouchableOpacity>

                  <Text className="mx-3 text-green-800">{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-green-200 px-2 rounded"
                  >
                    <Text className="text-lg">+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  className="mt-2"
                >
                  <Text className="text-red-500 text-sm">🗑 Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View className="absolute bottom-16 left-4 right-4 bg-white p-4 rounded-xl shadow-lg">
          <Text className="text-xl font-bold text-green-900 mb-2">
            Total: R{total.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-green-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNavigation />
    </SafeAreaView>
  );
}
