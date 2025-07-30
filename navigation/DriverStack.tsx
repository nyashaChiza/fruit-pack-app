import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/driver/HomeScreen";
import DriverOrderListScreen from "../screens/driver/DriverOrderListScreen";
import AvailableOrderListScreen from "../screens/driver/AvailableOrderListScreen";
import CompleteOrderListScreen from "../screens/driver/CompleteOrderListScreen";
import ClaimListScreen from "../screens/driver/ClaimsListScreen";
import OrderDetailsScreen from "screens/driver/OrderDetailScreen";
import LoginScreen from "screens/auth/LoginScreen";
import SignupScreen from "screens/auth/SignupScreen";
import SystemClaimListScreen from "screens/driver/SystemClaimsListScreen";
import ClaimDetailScreen from "screens/driver/ClaimsDetailScreen";

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={HomeScreen} />
      <Stack.Screen name="AvailableOrders" component={AvailableOrderListScreen} />
      <Stack.Screen name="CompleteOrders" component={CompleteOrderListScreen} />
      <Stack.Screen name="DriverOrders" component={DriverOrderListScreen} />
      <Stack.Screen name="Claims" component={ClaimListScreen} />
      <Stack.Screen name="ClaimDetail" component={ClaimDetailScreen} />
      <Stack.Screen name="SystemClaims" component={SystemClaimListScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
}
