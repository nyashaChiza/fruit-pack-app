// AssignedOrderListScreen.tsx
import { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { getToken } from "../../services/authServices";
import { getDriverDetails } from "../../services/userServices";
import api from "../../services/api";
import OrderCard from '../../components/ui/OrderCard';
import { Order } from "../../types";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DriverBottomNavigation from "../../components/common/DriverBottomNavigation";
import { showToast } from "services/toastService";

export default function CompleteOrderListScreen() {
  const [driverDetails, setDriverDetails] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const token = await getToken();
      const details = await getDriverDetails(token);
      setDriverDetails(details);
    };
    fetchDriverDetails();
  }, []);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      if (!driverDetails) return;
      try {
        const token = await getToken();
        if (!token) return;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get(`/orders/driver/${driverDetails.id}/delivered-orders`);
        setOrders(res.data);
      } catch (err) {
        console.info("Error fetching delivered orders:", err);
        showToast('info', 'Info', err.response?.data?.detail || 'Failed to load delivered orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, [driverDetails]);

  const handlePressOrder = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  if (loading) return <Text className="p-4 text-center text-gray-400">Loading delivered orders...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <View className="flex-1 ">
        <Text className="text-2xl font-bold text-green-900 p-4 text-center">Delivered Orders</Text>
        {orders.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">No delivered orders at the moment.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderCard order={item} onPress={() => handlePressOrder(item)} />}
            contentContainerStyle={{ padding: 16 }}
          />
        )}


      </View>
      {/* 🔚 Bottom Navigation */}
      <DriverBottomNavigation />
    </SafeAreaView>
  );
}