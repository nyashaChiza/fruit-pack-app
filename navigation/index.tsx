import { NavigationContainer } from "@react-navigation/native";
import CustomerStack from "./CustomerStack";
import DriverStack from "./DriverStack";
import AuthStack from "./AuthStack";
// Update the import path if the hook is located elsewhere, for example:
import { useAuth } from "../hooks/useAuth"; // <-- Ensure this file exists and exports useAuth


// Toggle between driver and customer flow based on role
function AppNavigator() {
  const { user } = useAuth();


  return (
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
  );
}


export default AppNavigator;
