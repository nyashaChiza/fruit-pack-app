import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { getUserDetails } from "../../services/userServices";
import { getToken } from "../../services/authServices";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../../components/common/BottomNavigation";
import { useAuth } from "../../hooks/useAuth";
import api from '../../services/api';
import { showToast } from '../../services/toastService';

export default function ProfileScreen() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  const { logoutUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        setToken(token);
        if (!token) {
          console.warn("No token found");
          return;
        }
        const data = await getUserDetails(token);
        setUserDetails(data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
    fetchData();
  }, []);

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "⚠️ This action is permanent and cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteAccount },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    if (!token || !userDetails?.id) {
      showToast('error', 'Missing User Info', 'Cannot delete account. Missing user info');
      return;
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.delete(`/users/${userDetails.id}`);

      if (response.status === 200 || response.status === 204) {
        showToast('success', 'Account Deleted', 'Your account has been permanently deleted.');
        logoutUser(); // log out the user safely
        navigation.navigate("LoginScreen");
      } else {
        showToast('error', 'Failed to delete account', 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      console.error("Delete account failed", err);
      showToast('error', 'Failed to delete account', 'Failed to delete account. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView className="px-4 pt-6 pb-28">
        {/* 👤 Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-green-900 mb-1">
            <MaterialIcons name="person-pin" size={24} color="green" />{" "}
            {userDetails?.full_name || ""}
          </Text>
        </View>

        {/* ⚙️ Profile Options */}
        <Text className="text-lg font-semibold text-green-900 mb-3">Profile</Text>
        <View className="space-y-4">
          <TaskCard
            icon={<Feather name="edit-3" size={20} color="green" />}
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <TaskCard
            icon={<Feather name="file-text" size={20} color="green" />}
            label="Terms & Conditions"
            onPress={() => Linking.openURL("https://fruit-pack-admin.onrender.com/terms")}
          />
          <TaskCard
            icon={<Feather name="shield" size={20} color="green" />}
            label="Policies"
            onPress={() => Linking.openURL("https://fruit-pack-admin.onrender.com/policies")}
          />
        </View>

        {/* 🚨 Sensitive Actions */}
        <Text className="text-lg font-semibold text-red-600 mt-6 mb-3">
          Sensitive Actions
        </Text>
        <View className="space-y-4">
          <TaskCard
            icon={<Feather name="user-x" size={20} color="red" />}
            label="Permanently Delete Account"
            labelColor="text-red-500"
            onPress={confirmDelete}
          />
        </View>
      </ScrollView>
       <BottomNavigation />
    </SafeAreaView>
  );
}

function TaskCard({
  icon,
  label,
  onPress,
  labelColor = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  labelColor?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white/80 flex-row items-center justify-between px-5 py-4 my-3 rounded-xl shadow-sm"
    >
      <View className="flex-row items-center">
        {icon}
        <Text className={`ml-3 font-medium text-base ${labelColor}`}>
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color="gray" />
    </TouchableOpacity>

  );
}
