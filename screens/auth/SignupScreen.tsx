import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { showToast } from "services/toastService";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const navigation = useNavigation();

  const { signupUser } = useAuth();

  const handleSignup = async () => {
    setIsLoading(true);

    if (!email || !password || !verifyPassword || !username || !fullName) {
      showToast('error', 'Missing Fields', 'Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (password !== verifyPassword) {
      showToast('error', 'Password Mismatch', 'Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      await signupUser(email, username, fullName, password);
      showToast('success', 'Signup Successful', 'You can now log in with your credentials.');
      navigation.navigate('LogIn');
    } catch (e) {
      showToast('error', 'Signup Failed', 'Please try again later.');
    } finally {
      setIsLoading(false);
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
          <MaterialIcons name="person-add" size={24} color="green" /> Create Your Account
        </Text>

        {/* Full Name */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="user" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-700 py-3"
            placeholder="Full Name"
            placeholderTextColor="#8c9aa8ff"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Username */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="at-sign" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-700 py-3"
            placeholder="Username"
            placeholderTextColor="#8c9aa8ff"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="mail" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-700 py-3"
            placeholder="Email"
            placeholderTextColor="#8c9aa8ff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="lock" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-800 py-3"
            placeholder="Password"
            placeholderTextColor="#8c9aa8ff"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Verify Password */}
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-2">
          <Feather name="lock" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <TextInput
            className="flex-1 text-base text-gray-800 py-3"
            placeholder="Verify Password"
            placeholderTextColor="#8c9aa8ff"
            secureTextEntry
            autoComplete="password"
            value={verifyPassword}
            onChangeText={setVerifyPassword}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          className="bg-green-600 py-3 rounded-lg items-center mt-2 flex-row justify-center"
        >
          <Feather name="user-plus" size={18} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white font-semibold text-base">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-200 py-3 rounded-lg items-center mt-3 flex-row justify-center"
        >
          <Feather name="arrow-left" size={18} color="#333" style={{ marginRight: 6 }} />
          <Text className="text-gray-800 font-semibold text-base">Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}