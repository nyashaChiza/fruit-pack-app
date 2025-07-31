import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomNavigation from "../../components/common/BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Product, Category } from "../../types";
import api from "../../services/api";
import { getToken } from "../../services/authServices";

// Dummy ads instead of banner images
const dummyAds = [
  { id: "ad1", title: "Fresh Mangoes Sale!", description: "amazing prices" },
  { id: "ad2", title: "Organic Apples", description: "fresh produce" },
  { id: "ad3", title: "Exotic Fruits Delivered", description: "Try now!" },
  { id: "ad4", title: "Seasonal Discounts", description: "Limited time offer" },
];

export default function CustomerHomeScreen() {
  const navigation = useNavigation();

  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fruits, setFruits] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cachedImages, setCachedImages] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      const savedToken = await getToken();
      setToken(savedToken);
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err: any) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchFruits = async () => {
      try {
        setLoading(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/products/");
        setFruits(res.data);

        const imageMap: Record<string, string> = {};
        await Promise.all(
          res.data.map(async (item: any) => {
            const imageUrl = `${api.defaults.baseURL}products/images/${item.image}`;
            const localUri = `${FileSystem.cacheDirectory}${item.image}`;
            const fileInfo = await FileSystem.getInfoAsync(localUri);
            if (!fileInfo.exists) {
              await FileSystem.downloadAsync(imageUrl, localUri, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            imageMap[item.id] = localUri;
          })
        );
        setCachedImages(imageMap);
      } catch (err: any) {
        console.error("Failed to fetch fruits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFruits();
  }, [token]);

  const filteredFruits = fruits.filter((fruit: Product) => {
    const matchesSearch = fruit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || fruit.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePressProduct = (SelectedProduct: Product) => {
    navigation.navigate("ProductDetail", { SelectedProduct });
  };

  const renderFruitItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handlePressProduct(item)}
      className="flex-row bg-white rounded-2xl mb-4 shadow-md overflow-hidden"
    >
      <Image
        source={{
          uri:
            cachedImages[item.id] ||
            `${api.defaults.baseURL}products/images/${item.image}`,
        }}
        className="w-24  rounded-l-2xl"
      />
      <View className="flex-1 p-4 justify-center">
        <Text className="text-lg font-semibold text-green-800">{item.name}</Text>
        <Text className="text-green-700 font-bold text-base mt-1">
          R{item.price?.toFixed(2)} / {item.unit}
        </Text>
        <Text className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</Text>
        <Text className="text-green-600 font-medium text-xs mt-2">{item.category_name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!token) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-green-100">
        <Text className="text-green-700 font-semibold">Loading authentication...</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-green-100">
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      {/* Top Section */}
      <View className="p-4 pb-0">
        {/* Search Box */}
        <View className="flex-row items-center mb-4 bg-white rounded-xl px-4 py-3">
          <Feather name="search" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search fruits..."
            placeholderTextColor="#4CAF50"
            className="flex-1 text-green-800 text-base py-2"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
        </View>

        {/* Ads Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {dummyAds.map((ad) => (
            <View key={ad.id} className="w-72 h-40 bg-green-300 rounded-2xl mr-4 p-5 justify-center shadow-sm">
              <Text className="text-white font-bold text-4xl mb-2">
                <Feather name="tag" size={22} color="white" /> {ad.title}
              </Text>
              <Text className="text-white text-lg">{ad.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Middle Section */}
      <ScrollView className="px-4">
        {/* Categories */}
        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <Feather name="grid" size={20} color="green" />
            <Text className="text-green-900 font-semibold text-xl ml-2">Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat: any) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className={`rounded-xl px-5 py-3 mr-4 items-center justify-center ${isSelected ? "bg-green-200" : "bg-white"}`}
                >
                  <View className="mb-1">
                    {typeof cat.icon === "string" ? (
                      <Text className="text-green-700 text-lg">{cat.icon}</Text>
                    ) : (
                      cat.icon
                    )}
                  </View>
                  <Text className={`font-medium ${isSelected ? "text-green-900" : "text-green-800"}`}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Fruits */}
        <View className="pb-20">
          <View className="flex-row items-center mb-4">
            <Feather name="star" size={20} color="green" />
            <Text className="text-green-900 font-semibold text-xl ml-2">Popular Fruits</Text>
          </View>
          {filteredFruits.length === 0 ? (
            <Text className="text-center text-gray-500">No fruits found for selected category.</Text>
          ) : (
            filteredFruits.map((item) => renderFruitItem({ item }))
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNavigation />
    </SafeAreaView>
  );
}
