import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "../screens/auth/SignupScreen";
import LoginScreen from "../screens/auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
