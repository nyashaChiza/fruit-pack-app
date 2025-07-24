import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/driver/HomeScreen";
import OrderListScreen from "../screens/driver/OrderListScreen";
import ClaimListScreen from "../screens/driver/ClaimsListScreen";
import OrderDetailScreen from "screens/driver/OrderDetailScreen";

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Orders" component={OrderListScreen} />
      <Stack.Screen name="Claims" component={ClaimListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
