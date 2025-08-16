import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerHomeScreen from "../screens/customer/HomeScreen";
import ProductDetailScreen from "../screens/customer/ProductDetailScreen";
import CartScreen from "../screens/customer/CartScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";
import OrderDetailScreen from "screens/customer/OrderDetailScreen";
import OrderListScreen from "screens/customer/OrderListScreen";
import LoginScreen from "screens/auth/LoginScreen";
import SignupScreen from "screens/auth/SignupScreen";
import PaystackCheckout from "screens/customer/PayStackWebView";
import EditProfileScreen from "screens/customer/EditProfileScreen";
import ProfileScreen from "screens/customer/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="PaystackCheckout" component={PaystackCheckout} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
