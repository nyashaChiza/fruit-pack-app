import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "../../services/authServices";

export default function BottomNavigation() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/screens/home")}>
        <Text style={styles.text}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/cart")}>
        <Text style={styles.text}>🛒 Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/orders")}>
        <Text style={styles.text}>📦 Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await logout();
          router.replace("/screens/login");
        }}
      >
        <Text style={styles.text}>👤 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    width: Dimensions.get("window").width,
    zIndex: 100,
  },
  text: {
    color: "#047857",
    fontWeight: "600",
    fontSize: 18,
  },
});
