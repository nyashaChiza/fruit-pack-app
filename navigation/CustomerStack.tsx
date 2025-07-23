import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/customer/HomeScreen";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
import CartScreen from "../screens/customer/CartScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";

const Stack = createNativeStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
