import { NavigationContainer } from "@react-navigation/native";
import CustomerStack from "./CustomerStack";
import DriverStack from "./DriverStack";
import AuthStack from "./AuthStack";
import { useAuth } from "../hooks/useAuth"; 


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
