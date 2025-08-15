import { NavigationContainer } from "@react-navigation/native";
import CustomerStack from "./CustomerStack";
import DriverStack from "./DriverStack";
import AuthStack from "./AuthStack";
import { useAuth } from "../hooks/useAuth";
import { PaystackProvider } from "react-native-paystack-webview"; // 👈 import this

function AppNavigator() {
  const { user } = useAuth();

  return (
    <PaystackProvider publicKey="pk_test_57b3f4aa2750394d0b16727a063682061aaf9eb7"> 
      <NavigationContainer>
        {user ? (
          user.role === "driver" ? (
            <DriverStack />
          ) : (
            <CustomerStack />
          )
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </PaystackProvider>
  );
}

export default AppNavigator;