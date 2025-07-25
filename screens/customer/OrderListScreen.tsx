import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../../components/common/BottomNavigation";
import api from "../../services/api";
import { getToken } from "../../services/authServices";
import { getUserId } from "../../services/userServices";
import { Order } from "../../types";


export default function OrdersListScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert("Unauthorized", "Please log in.");
          return;
        }
        const userId = await getUserId(token);

        if (!userId) {
          Alert.alert("Unauthorized", "Please log in.");
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get(`/orders/user/${userId}/orders`);
        setOrders(response.data);
      } catch (err: any) {
        console.info("Fetch orders error:", err.response?.data || err.message);
        Alert.alert( "Could not fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePressOrder = (order: Order) => {
      navigation.navigate("OrderDetail", { order });
  };

  const statusColor = {
    completed: "bg-green-600",
    cancelled: "bg-red-500",
    pending: "bg-yellow-400",
  };

const renderOrder = ({ item, index }: { item: Order; index: number }) => (
    <TouchableOpacity 
  onPress={() => handlePressOrder(item)}
  className="bg-white shadow-sm rounded-xl px-4 py-3 mb-4 border border-gray-100 mx-3"
>
  
  <View className="flex-row justify-between items-center mb-2 ">
    <Text className="text-base font-semibold text-green-900">
      Order #{item.id}
    </Text>
    <View
      className={`px-2 py-0.5 rounded-full ${
        statusColor[item.delivery_status] ?? "bg-gray-400"
      }`}
    >
      <Text className="text-xs font-medium text-white uppercase">
        {item.delivery_status?.toUpperCase() ?? "UNKNOWN"}
      </Text>
    </View>
  </View>

  <View className="flex-row items-center gap-2 mb-1">
    <Feather name="dollar-sign" size={16} color="gray" />
    <Text className="text-sm text-gray-700">
      Total: R{Number(item.total).toFixed(2)}
    </Text>
  </View>

  <View className="flex-row items-center gap-2">
    <Feather name="calendar" size={16} color="gray" />
    <Text className="text-sm text-gray-600">
      {new Date(item.created).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Text>
  </View>
</TouchableOpacity>
);

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      
<View className="flex-1">
        <Text className="text-2xl font-bold text-green-800 mt-6 mb-4 text-center">
          My Orders
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : (
           <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderOrder}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <BottomNavigation />
    </SafeAreaView>
  );
}