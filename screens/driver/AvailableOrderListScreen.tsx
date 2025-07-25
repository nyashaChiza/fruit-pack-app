// AssignedOrderListScreen.tsx
import { useEffect, useState } from 'react';
import { Alert, FlatList, View, Text } from 'react-native';
import { getToken } from  "../../services/authServices";
import { getDriverDetails } from  "../../services/userServices";
import api from "../../services/api";
import OrderCard from '../../components/ui/OrderCard';
import { Order } from "../../types";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DriverBottomNavigation from "../../components/common/DriverBottomNavigation";

export default function AvailableOrderListScreen() {
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
        const res = await api.get(`/orders/available/orders`);
        setOrders(res.data);
      } catch (err) {
        Alert.alert('Notice', err.response?.data?.detail || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, [driverDetails]);
  
  const handlePressOrder = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  if (loading) return <Text className="p-4 text-center text-gray-400">Loading available orders...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-green-50">
    <View className="flex-1 ">
      <Text className="text-2xl font-bold text-green-900 p-4 text-center">Available Orders</Text>
      {orders.length === 0 ? (
        <Text className="text-center text-gray-500 mt-4">No available orders at the moment.</Text>
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