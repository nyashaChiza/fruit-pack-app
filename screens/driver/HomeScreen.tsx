import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { useEffect, useState } from 'react';
import api from "../../services/api";
import * as Location from 'expo-location';
import { getDriverDetails, getUserDetails } from "../../services/userServices";
import { getToken } from "../../services/authServices";
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DriverBottomNavigation from "../../components/common/DriverBottomNavigation";



export default function HomeScreen() {
  const navigation = useNavigation();
  const [driverDetails, setDriverDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [online, setOnline] = useState(true);

  // Fetch user details and token on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await getToken();
      setUserDetails(await getUserDetails(token));
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const token = await getToken();
      const details = await getDriverDetails(token);
      setDriverDetails(details);
    };
    fetchDriverDetails();
  }, []);

  const handleToggleAvailability = async () => {
    const newStatus = online ? 'offline' : 'available';
    setOnline(!online);
    try {
      if (driverDetails?.id) {
        const token = await getToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.patch(`/drivers/${driverDetails.id}/status`, { status: newStatus });
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.detail || 'Failed to update status');
      setOnline(online); // revert on error
    }
  };

  const shareLiveLocation = async () => {
    try {
      // Ask for location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to share your live location.');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get token for authorization
      const token = await getToken();
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Post location to the API
      await api.post(`/drivers/driver/${driverDetails.id}/location`, { latitude, longitude });

      Alert.alert('Success', 'Live location shared!');
    } catch (err: any) {
      console.error('Error sharing live location:', err);
      Alert.alert('Error', err?.response?.data?.detail || 'Failed to share location');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">

      <ScrollView className="px-4 pt-6 pb-28">
        {/* 👋 Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-green-900 mb-1">
            <MaterialIcons name="person-pin" size={24} color="green" /> Welcome, {userDetails?.full_name || ''}
          </Text>

          {/* 🔄 Status Row */}
          <View className="flex-row items-center justify-between mt-2 bg-white/60 px-4 py-3 rounded-xl shadow-sm">
            <View className="flex-row items-center">
              {driverDetails?.status === 'busy' ? (
                <MaterialCommunityIcons name="progress-clock" size={20} color="orange" />
              ) : driverDetails?.status === 'available' ? (
                <Feather name="check-circle" size={20} color="green" />
              ) : (
                <Feather name="x-circle" size={20} color="red" />
              )}
              <Text className="ml-2 font-semibold text-gray-800">
                {driverDetails?.status === 'busy'
                  ? 'Busy'
                  : driverDetails?.status === 'available'
                    ? 'Available'
                    : 'Offline'}
              </Text>
            </View>
            <Switch value={online} onValueChange={handleToggleAvailability} />
          </View>
        </View>

        {/* 🧭 Task List */}
        <Text className="text-lg font-semibold text-green-900 mb-3">Home</Text>

        <View className="space-y-4">
          <TaskCard
            icon={<Feather name="package" size={20} color="green" />}
            label="Assigned Orders"
            onPress={() => navigation.navigate('DriverOrders')}
          />
          <TaskCard
            icon={<Feather name="truck" size={20} color="green" />}
            label="Available Orders"
            onPress={() => navigation.navigate('AvailableOrders')}
          />
          <TaskCard
            icon={<Feather name="check-square" size={20} color="green" />}
            label="Delivered Deliveries"
            onPress={() => navigation.navigate('CompleteOrders')}
          />
          <TaskCard
            icon={<Feather name="inbox" size={20} color="green" />}
            label="Order Claims"
            onPress={() => navigation.navigate('Claims')}
          />
          <TaskCard
            icon={<MaterialCommunityIcons name="map-marker-radius" size={20} color="green" />}
            label="Share Live Location"
            onPress={shareLiveLocation}
          />
        </View>
      </ScrollView>

      {/* 🔚 Bottom Navigation */}
      <DriverBottomNavigation />


    </SafeAreaView>
  );
}

function TaskCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white/80 flex-row items-center justify-between px-5 py-4 my-3 rounded-xl shadow-sm"
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="ml-3 font-medium text-gray-800 text-base">{label}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="gray" />
    </TouchableOpacity>
  );
}