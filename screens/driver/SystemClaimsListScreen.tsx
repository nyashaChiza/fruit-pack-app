import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken } from '../../services/authServices';
import { getDriverDetails } from '../../services/userServices';
import api from '../../services/api';
import DriverBottomNavigation from '../../components/common/DriverBottomNavigation';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Order } from "../../types";
import { showToast } from "services/toastService";

export default function SystemClaimListScreen() {
    const [driverDetails, setDriverDetails] = useState(null);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [order, setOrder] = useState<Order[]>([]);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            const token = await getToken();
            const details = await getDriverDetails(token);
            setDriverDetails(details);
        };
        fetchDriverDetails();
    }, []);

    useEffect(() => {
        const fetchClaims = async () => {
            if (!driverDetails) return;
            try {
                const token = await getToken();
                if (!token) return;

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await api.get(`/claims/system/${driverDetails.id}/claims`);
                setClaims(res.data);
            } catch (err) {
                showToast('info', 'Notification', err.response?.data?.detail || 'Failed to load system claims.');
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, [driverDetails]);

    const handlePressClaim = async (claim) => {
        try {
            const token = await getToken();
            if (!token) return;

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const res = await api.get(`/orders/${claim.order_id}`);
            const order = res.data;
            setOrder(order);

            navigation.navigate("ClaimDetail", { order, claim });
        } catch (err) {
            console.error("Error fetching claim details:", err);
            showToast('error', 'Error', err.response?.data?.detail || 'Failed to load claim details.');
        }
    };


    const renderClaim = ({ item }) => (
        <TouchableOpacity onPress={() => handlePressClaim(item)}
            className={`mb-4 p-4 rounded-xl mx-3 shadow-sm ${item.status === 'approved' ? 'bg-green-50 border border-green-300' : 'bg-white border border-gray-200'
                }`}
        >
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-semibold text-gray-900">
                    {item.status === 'approved' ? (
                        <MaterialIcons name="check-circle" size={18} color="green" />
                    ) : (
                        <MaterialIcons name="report-problem" size={18} color="orange" />
                    )}
                    {'  '}
                    Claim #{item.id}
                </Text>

                <View
                    className={`px-2 py-1 rounded-full ${item.status === 'approved' ? 'bg-green-100' : 'bg-orange-100'
                        }`}
                >
                    <Text
                        className={`text-xs font-medium uppercase ${item.status === 'approved' ? 'text-green-700' : 'text-orange-700'
                            }`}
                    >
                        {item.status || 'pending'}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mb-1">
                <Feather name="user" size={16} color="gray" />
                <Text className="ml-2 text-gray-700 text-sm">Order Ref: {item.order_id}</Text>
            </View>

            <View className="flex-row items-center">
                <Feather name="calendar" size={16} color="gray" />
                <Text className="ml-2 text-sm text-gray-600">
                    Created: {new Date(item.created).toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-green-50">

            <Text className="text-2xl font-bold my-3 text-green-900 text-center mb-6">System Claims</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4caf50" className="mt-16" />
            ) : claims.length === 0 ? (
                <Text className="text-gray-500 text-center mt-20">No system claims found.</Text>
            ) : (
                <FlatList
                    data={claims}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderClaim}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                />
            )}


            {/* 🔚 Bottom Navigation */}
            <DriverBottomNavigation />
        </SafeAreaView>
    );
}