import { View, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../services/authServices";

export default function BottomNavigation() {
  const navigation = useNavigation();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-around items-center py-6 px-4 border-t border-gray-300 shadow-md w-full z-50">
      <TouchableOpacity onPress={() => navigation.navigate("CustomerHome")}>
        <Ionicons name="home-outline" size={28} color="#047857" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
        <Ionicons name="cart-outline" size={28} color="#047857" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("OrderList")}>
        <Ionicons name="cube-outline" size={28} color="#047857" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await logout();
          navigation.replace("LoginScreen");
        }}
      >
        <Ionicons name="log-out-outline" size={28} color="#047857" />
      </TouchableOpacity>
    </View>
  );
}
