import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView, 
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getToken } from "../../services/authServices";
import { getUserDetails } from "../../services/userServices";
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../services/toastService';
import DriverBottomNavigation from "../../components/common/DriverBottomNavigation";

export default function EditProfileScreen() {
    const navigation = useNavigation();

    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { UpdateUser } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await getToken();
                if (!token) {
                     showToast('error', 'Validation Error', 'No authentication token found.');
                    return;
                }
                const data = await getUserDetails(token);
                setUserId(data.id);
                setFullName(data.full_name || "");
                setUsername(data.username || "");
                setEmail(data.email || "");
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        if (!fullName || !username || !email) {
            showToast('error', 'Validation Error', 'All fields are required.');
            return;
        }

        if (password && password !== verifyPassword) {
            showToast('error', 'Validation Error', 'Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);
            const token = await getToken();
            if (!token) {
                showToast('error', 'Validation Error', 'No authentication token found.');
                return;
            }

            await UpdateUser(Number(userId),email, username, fullName,'driver', password);

            showToast('success', 'Profile Update', 'Profile updated successfully.');
            navigation.goBack();
        } catch (err) {
            console.error("Update failed", err);
            showToast('error', 'Update Failed', 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <SafeAreaView className="flex-1 bg-green-100">
      <KeyboardAvoidingView
        className="flex-1 justify-center items-center relative"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Background Overlay */}
        <View className="absolute inset-0 bg-black/5" />

        {/* Form Container */}
        <View className="w-11/12 max-w-md bg-white/90 p-6 rounded-2xl shadow-lg">
          <Text className="text-center text-2xl font-bold text-green-800 mb-6 flex-row items-center">
            <MaterialIcons name="person" size={24} color="green" /> Edit Profile
          </Text>

          {/* Full Name */}
          <InputField
            icon={<Feather name="user" size={18} color="#4CAF50" />}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Username */}
          <InputField
            icon={<Feather name="at-sign" size={18} color="#4CAF50" />}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          {/* Email */}
          <InputField
            icon={<Feather name="mail" size={18} color="#4CAF50" />}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password */}
          <InputField
            icon={<Feather name="lock" size={18} color="#4CAF50" />}
            placeholder="New Password (leave blank to keep old one)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Verify Password */}
          <InputField
            icon={<Feather name="lock" size={18} color="#4CAF50" />}
            placeholder="Verify Password"
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            secureTextEntry
          />

          {/* Update Button */}
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isLoading}
            className="bg-green-600 py-3 rounded-lg items-center mt-2 flex-row justify-center"
          >
            <Feather name="save" size={18} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-semibold text-base">
              {isLoading ? "Updating..." : "Save Changes"}
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

      {/* Bottom Nav (outside KeyboardAvoidingView so it doesn’t move) */}
      <DriverBottomNavigation />
    </SafeAreaView>
  );
}

function InputField({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
}: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: any;
}) {
    return (
        <View className="flex-row items-center bg-green-50 rounded-lg mb-4 px-3 py-3">
            {icon}
            <TextInput
                className="flex-1 text-base text-gray-700 py-2"
                style={{ minHeight: 45 }}
                placeholder={placeholder}
                placeholderTextColor="#8c9aa8ff"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );
}
