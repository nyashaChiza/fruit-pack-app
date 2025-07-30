import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking
} from "react-native";
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import { getToken } from "../../services/authServices";
import { getDriverDetails } from "../../services/userServices";
import DriverBottomNavigation from "../../components/common/DriverBottomNavigation";
import { showToast } from "services/toastService";


export default function OrderDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order: selectedOrder } = route.params as { order: any };

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [driverDetails, setDriverDetails] = useState<any>(null);

  // Fetch user details and token on mount
  useEffect(() => {
    const fetchDriverDetails = async () => {
      const token = await getToken();
      setDriverDetails(await getDriverDetails(token));
    };
    fetchDriverDetails();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await getToken();
        if (!token || !selectedOrder?.id) throw new Error("Missing token or order ID");

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get(`/orders/${selectedOrder.id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        showToast('error', 'Error', 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [selectedOrder]);

  const deliverOrder = async () => {
    try {
      setLoading(true);
      await api.put(`/orders/${order.id}/status`, {
        status: 'delivered',
      });
      showToast('success', 'Order Delivered', 'Thank you for delivering the order.');
      navigation.navigate('DriverHome'); // Navigate back after successful delivery
    } catch (err) {
      console.error("Error delivering order:", err);
      showToast('error', 'Error', 'Failed to deliver order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const claimOrder = async () => {
    if (!driverDetails?.id) {
      showToast('error', 'Error', 'Driver details not found. Please try again later.');
      return;
    }

    try {
      await api.post(`/claims/claim/order/${order.id}/driver/${driverDetails.id}`);
      showToast('success', 'Order Claimed', 'You have successfully claimed the order.');
      navigation.navigate('DriverHome'); // Navigate back after successful delivery
    } catch (err) {
      console.error("Error claiming order:", err);
      showToast('error', 'Error', err.response?.data?.detail || 'Failed to claim order.');
    }
  };

  const handleNavigation = () => {
    if (
      !driverDetails?.latitude || !driverDetails?.longitude ||
      !order?.destination_latitude || !order?.destination_longitude
    ) {
      showToast('error', 'Error', 'Driver or order location not available.');
      return;
    }

    const origin = `${driverDetails.latitude},${driverDetails.longitude}`;
    const destination = `${order.destination_latitude},${order.destination_longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.openURL(url).catch(err => {
      console.error("Failed to open Google Maps:", err);
      showToast('error', 'Error', 'Failed to open navigation. Please try again later.');
    });
  };


  const statuses = [
    { key: "pending", label: "Ordered", description: "Order received" },
    { key: "processing", label: "Processing", description: "Preparing for delivery" },
    { key: "shipped", label: "Shipped", description: "On the way" },
    { key: "delivered", label: "Delivered", description: "Product delivered" },
    { key: "completed", label: "Completed", description: "Order completed" },
  ];

  const currentStatusIndex = statuses.findIndex(
    (s) => s.key === order?.delivery_status
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 text-base">No order data found.</Text>
        <TouchableOpacity
          className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
          onPress={() => navigation.goBack()} // ✅ Fix navigation usage
        >
          <Text className="text-gray-800 font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-green-800 mb-4 text-center">Order Details</Text>

        {/* Order Summary */}
        <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">Order #{order.order_number}</Text>
            <Feather name="package" size={20} color="green" />
          </View>
          <Text className="text-green-600 font-bold mb-1">
            <Feather name="dollar-sign" size={16} color="gray" /> Total: R{order.total.toFixed(2)}
          </Text>
          <Text className="text-gray-600 mb-1">
            <Feather name="calendar" size={16} color="gray" /> Date: {new Date(order.created).toLocaleString()}
          </Text>
          <Text className="text-gray-700 mb-1">
            <MaterialIcons name="local-shipping" size={16} color="gray" /> Delivery Status:{" "}
            <Text className="font-semibold">{order.delivery_status}</Text>
          </Text>
          <Text className="text-gray-700 mb-1">
            <Feather name="credit-card" size={16} color="gray" /> Payment Status:{" "}
            <Text className="font-semibold">{order.payment_status}</Text>
          </Text>
          {order.distance_from_driver != null && (
            <Text className="text-gray-700">
              <MaterialCommunityIcons name="bike" size={16} color="gray" /> Distance From Order:{" "}
              <Text className="font-semibold">{order.distance_from_driver}km</Text>
            </Text>
          )}
        </View>

        {/* Items Section */}
        <View className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2 flex-row items-center">
            <Feather name="shopping-cart" size={18} color="gray" /> Items
          </Text>
          {order.items?.length > 0 ? (
            order.items.map((item: any) => (
              <View key={item.id} className="mb-3 border-b border-gray-100 pb-2">
                <Text className="text-gray-700 font-medium">
                  <MaterialIcons name="local-grocery-store" size={16} color="gray" /> Product: {item.name}
                </Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
                <Text className="text-gray-600">Price: R{item.price.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-600">No items found.</Text>
          )}
        </View>
        <View className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2 flex-row items-center">
            <Feather name="map" size={18} color="gray" /> Delivery Location
          </Text>
          <TouchableOpacity
            onPress={handleNavigation}
            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Navigate to Delivery</Text>
          </TouchableOpacity>
        </View>


        {/* Timeline Section */}
        <View className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3 flex-row items-center">
            <Feather name="clock" size={18} color="gray" /> Order Status Timeline
          </Text>
          {statuses.map((status, index) => (
            <View key={status.key} className="flex-row items-start mb-3">
              <Feather
                name={index <= currentStatusIndex ? "check-circle" : "clock"}
                size={16}
                color={index <= currentStatusIndex ? "green" : "gray"}
                style={{ marginTop: 2 }}
              />
              <View className="ml-3">
                <Text
                  className={`font-semibold ${index <= currentStatusIndex ? "text-green-700" : "text-gray-600"}`}
                >
                  {status.label}
                </Text>
                <Text className="text-sm text-gray-500">{status.description}</Text>
              </View>
            </View>
          ))}
          {order.delivery_status === 'pending' && (
            <TouchableOpacity
              className="bg-green-600 py-3 mt-4 rounded-lg items-center flex-row justify-center"
              onPress={claimOrder}
            >
              <Feather name="check" size={18} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">Claim Order</Text>
            </TouchableOpacity>
          )}

          {order.delivery_status === 'shipped' && (
            <TouchableOpacity
              className="bg-green-600 py-3 mt-4 rounded-lg items-center flex-row justify-center"
              onPress={deliverOrder}
            >
              <Feather name="check" size={18} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">Mark As Delivered</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      {/* Bottom Nav Stub */}
      <DriverBottomNavigation />
    </SafeAreaView>


  );
}
