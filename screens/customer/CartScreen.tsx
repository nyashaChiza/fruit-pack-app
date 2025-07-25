import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useCart } from "../../hooks/useCart";
import api from "../../services/api";
import BottomNavigation from "../../components/common/BottomNavigation";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
  <ScrollView className="px-4 pb-56 pt-4">
    <Text className="text-2xl font-bold text-green-800 mt-6 mb-4 text-center">
      <Feather name="shopping-cart" size={22} color="green" /> My Cart
    </Text>

    {cart.length === 0 ? (
      <View className="mt-20 items-center">
        <Feather name="shopping-bag" size={40} color="gray" />
        <Text className="text-gray-500 text-center mt-2">Your cart is empty.</Text>
      </View>
    ) : (
      cart.map((item) => (
        <View key={item.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex-row">
          <Image
            source={{ uri: `${api.defaults.baseURL}products/images/${item.image_name}` }}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4 justify-between">
            <View>
              <Text className="text-lg font-semibold text-green-900 flex-row items-center">
                <MaterialIcons name="local-grocery-store" size={16} color="green" /> {item.name}
              </Text>
              <Text className="text-sm text-green-700">
                <Feather name="tag" size={14} color="gray" /> R{item.price.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                className="bg-green-200 px-3 py-1 rounded"
              >
                <Feather name="minus" size={16} color="green" />
              </TouchableOpacity>

              <Text className="mx-3 text-green-800 font-semibold">{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-green-200 px-3 py-1 rounded"
              >
                <Feather name="plus" size={16} color="green" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.id)} className="mt-2 flex-row items-center">
              <Feather name="trash" size={14} color="red" style={{ marginRight: 4 }} />
              <Text className="text-red-500 text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))
    )}
  </ScrollView>

  {cart.length > 0 && (
    <View className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-xl shadow-lg">
      <Text className="text-xl font-bold text-green-900 mb-2">
        <Feather name="credit-card" size={18} color="green" /> Total: R{total.toFixed(2)}
      </Text>
      <TouchableOpacity onPress={handleCheckout} className="bg-green-600 py-3 rounded-xl flex-row justify-center items-center">
        <Feather name="check-circle" size={18} color="white" style={{ marginRight: 6 }} />
        <Text className="text-white text-center font-semibold text-lg">Checkout</Text>
      </TouchableOpacity>
    </View>
  )}

  <View className="absolute bottom-0 left-0 right-0">
    <BottomNavigation />
  </View>
</SafeAreaView>

  );
}
