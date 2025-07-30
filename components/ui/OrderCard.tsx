import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function OrderCard({ order, onPress }: { order: any; onPress?: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 p-4 rounded-xl shadow-sm bg-white border border-gray-200"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-800">Order #{order.order_number}</Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(order.payment_status)}`}>
          <Text className="text-xs font-medium">{order.payment_status}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-1">
        <MaterialIcons name="person" size={16} color="#6B7280" />
        <Text className="ml-1 text-sm text-gray-600">{order.customer_name}</Text>
      </View>

      <View className="flex-row items-center mb-1">
        <MaterialIcons name="location-on" size={16} color="#6B7280" />
        <Text className="ml-1 text-sm text-gray-600">{order.destination_address}</Text>
      </View>
      {order.distance_from_driver != null && (
            <View className="flex-row items-center mb-1">
              <MaterialCommunityIcons name="bike" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-600">{order.distance_from_driver}km</Text>
            </View>
          )}

      <View className="flex-row items-center mb-1">
        <MaterialIcons
          name={
        order.payment_method === 'cash'
          ? 'attach-money'
          : order.payment_method === 'card'
          ? 'credit-card'
          : 'payment'
          }
          size={16}
          color="#6B7280"
        />
        <Text className="ml-1 text-sm text-gray-600">{order.payment_method}</Text>
      </View>

      <View className="flex-row items-center">
        <MaterialIcons name="schedule" size={16} color="#6B7280" />
        <Text className="ml-1 text-sm text-gray-600">
          {format(new Date(order.created), 'PPPp')}
        </Text>
      </View>
    </Pressable>
  );
}