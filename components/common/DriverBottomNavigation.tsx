import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { logout } from '../../services/authServices';

export default function DriverBottomNavigation() {
    const navigation = useNavigation();

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-around items-center py-6 px-4 border-t border-gray-300 shadow-md w-full z-50">
            <View className="flex-row bg-white rounded-xl shadow-md overflow-hidden">
                {/* 🏠 Home */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-300"
                >
                    <Feather name="home" size={18} color="green" style={{ marginRight: 6 }} />
                    <Text className="text-green-600 font-semibold text-base">Home</Text>
                </TouchableOpacity>

                {/* 🔒 Logout */}
                <TouchableOpacity
                    onPress={async () => {
                        await logout();
                        navigation.replace('LoginScreen');
                    }}
                    className="flex-1 flex-row items-center justify-center py-3"
                >
                    <Feather name="log-out" size={18} color="red" style={{ marginRight: 6 }} />
                    <Text className="text-red-500 font-semibold text-base">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}