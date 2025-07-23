import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
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
      className="flex-1 justify-center items-center bg-green-200 relative"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="absolute inset-0 bg-black/5" />

      <View className="w-11/12 max-w-md bg-white/90 p-6 rounded-2xl shadow-lg">
        <Text className="text-center text-2xl font-bold text-green-800 mb-6">
          Welcome Back
        </Text>

        <TextInput
          className="bg-green-50 text-base text-gray-700 p-3 rounded-lg mb-4"
          placeholder="Username"
          placeholderTextColor="#8c9aa8ff"
          autoCapitalize="none"
          autoComplete="username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          className="bg-green-50 text-base text-gray-800 p-3 rounded-lg mb-4"
          placeholder="Password"
          placeholderTextColor="#8c9aa8ff"
          autoCapitalize="none"
          autoComplete="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="bg-green-500 py-3 rounded-lg items-center mt-2"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 py-3 rounded-lg items-center mt-3"
          onPress={() => router.push("/")}
        >
          <Text className="text-gray-800 font-semibold text-base">Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
