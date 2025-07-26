import { useState } from "react";
import { Feather, MaterialIcons } from '@expo/vector-icons';

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Missing Fields", "Please enter both username and password");
      return;
    }

    try {
      await loginUser(username, password);
    } catch (err) {
      Alert.alert("Login Failed", "Invalid credentials or server error");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-green-100 relative"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="absolute inset-0 bg-black/5" />

      <View className="w-11/12 max-w-md bg-white/90 p-6 rounded-2xl shadow-lg">
        <Text className="text-center text-2xl font-bold text-green-800 mb-6">
          <MaterialIcons name="lock" size={24} color="green" /> Welcome Back
        </Text>

        {/* Username Field */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="user" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-700"
            placeholder="Username"
            placeholderTextColor="#8c9aa8ff"
            autoCapitalize="none"
            autoComplete="username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Password Field */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="lock" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Password"
            placeholderTextColor="#8c9aa8ff"
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="bg-green-500 py-3 rounded-lg items-center mt-2 flex-row justify-center"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Feather name="log-in" size={18} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white font-semibold text-base">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          className="bg-gray-200 py-3 rounded-lg items-center mt-3 flex-row justify-center"
        >
          <Feather name="arrow-left" size={18} color="#333" style={{ marginRight: 6 }} />
          <Text className="text-gray-800 font-semibold text-base">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

  );
}
