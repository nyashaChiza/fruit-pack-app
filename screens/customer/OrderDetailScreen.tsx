import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from "../../services/api";
import { getToken } from "../../services/authServices";
import  BottomNavigation  from '../../components/common/BottomNavigation';

export default function OrderDetailScreen() {

  const route = useRoute();

  const { SelectedOrder } = route.params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getToken();
      setToken(savedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token || !SelectedOrder.id) return;
    const fetchOrder = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get(`/orders/${SelectedOrder.id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        Alert.alert('Error', 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [token, SelectedOrder.id]);

  const confirmDelivery = async () => {
    try {
      await api.post(`/orders/${SelectedOrder.id}/confirm-delivery`);
      Alert.alert('Success', 'Order confirmed as completed');
      route.navigate('OrdersListScreen');
    } catch (err) {
      Alert.alert('Error', 'Could not confirm delivery');
    }
  };

  const statuses = [
    { key: 'pending', label: 'Ordered', description: 'Order received' },
    { key: 'processing', label: 'Processing', description: 'Preparing for delivery' },
    { key: 'shipped', label: 'Shipped', description: 'On the way' },
    { key: 'delivered', label: 'Delivered', description: 'Product delivered' },
    { key: 'completed', label: 'Completed', description: 'Order completed' },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === order?.delivery_status);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large"  />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 text-base">No order data found.</Text>
        <TouchableOpacity className="mt-4 bg-gray-200 px-4 py-2 rounded-lg" onPress={() => route.back()}>
          <Text className="text-gray-800 font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-green-800 mb-4">Order Details</Text>

        <View className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-700 mb-1">Order ID: #{order.id}</Text>
          <Text className="text-green-600 text-base font-bold mb-1">Total: R{order.total.toFixed(2)}</Text>
          <Text className="text-gray-600 mb-1">Date: {new Date(order.created).toLocaleString()}</Text>
          <Text className="text-gray-600 mb-1">Delivery Status: <Text className="font-semibold">{order.delivery_status}</Text></Text>
          <Text className="text-gray-600">Payment Status: <Text className="font-semibold">{order.payment_status}</Text></Text>
        </View>

        <View className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Items</Text>
          {order.items?.length > 0 ? (
            order.items.map((item: any) => (
              <View key={item.id} className="mb-3">
                <Text className="text-gray-700 font-medium">Product: {item.name}</Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
                <Text className="text-gray-600">Price: R{item.price.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-600">No items found.</Text>
          )}
        </View>

        <View className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Order Status Timeline</Text>
          {statuses.map((status, index) => (
            <View key={status.key} className="flex-row items-start mb-3">
              <View className={`w-4 h-4 rounded-full mt-1 ${index <= currentStatusIndex ? 'bg-green-600' : 'bg-gray-400'}`} />
              <View className="ml-3">
                <Text className={`font-semibold ${index <= currentStatusIndex ? 'text-green-700' : 'text-gray-600'}`}>{status.label}</Text>
                <Text className="text-sm text-gray-500">{status.description}</Text>
              </View>
            </View>
          ))}

          {order.delivery_status === 'delivered' && (
            <TouchableOpacity className="bg-green-600 py-3 mt-4 rounded-lg items-center" onPress={confirmDelivery}>
              <Text className="text-white font-semibold">Confirm Delivery</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity className="mt-3 bg-gray-200 py-3 rounded-lg items-center" onPress={() => router.back()}>
            <Text className="text-gray-800 font-semibold">Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}
