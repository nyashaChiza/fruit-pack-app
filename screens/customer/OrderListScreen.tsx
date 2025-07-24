import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import BottomNavigation from "@/components/BottomNavigation";
import api from "../../services/api";
import { getToken } from "../../services/authServices";
import { getUserId } from "../../services/userServices";
import { useNavigation } from '@react-navigation/native';
import { Order } from "../../types";

export default function OrdersListScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId(token);

        if (!token || !userId) {
          Alert.alert("Unauthorized", "Please log in.");
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get(`/orders/user/${userId}/orders`);
        setOrders(response.data);
      } catch (err: any) {
        console.error("Fetch orders error:", err.response?.data || err.message);
        Alert.alert("Error", "Could not fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePressOrder = (order: Order ) => {
    navigation.navigate('OrderDetails', { order });
  };

  const renderOrder = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-lg"
    >
      <TouchableOpacity
        onPress={() =>
          handlePressOrder(item)
        }
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-base font-semibold text-black">
            Order #{item.id}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${
              item.delivery_status === "completed"
                ? "bg-green-500"
                : item.delivery_status === "cancelled"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            <Text className="text-white text-xs font-medium uppercase">
              {item.delivery_status}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <Feather name="dollar-sign" size={18} color="gray" />
          <Text className="text-sm text-gray-800">
            Total: R{Number(item.total).toFixed(2)}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2 mt-1">
          <Feather name="calendar" size={18} color="gray" />
          <Text className="text-sm text-gray-800">
            {new Date(item.created).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center text-green-800 mt-6 mb-2">
            My Orders
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4caf50" />
          ) : (
            <FlatList
              data={orders.sort(
                (a, b) =>
                  new Date(b.created).getTime() -
                  new Date(a.created).getTime()
              )}
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
