import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUsername } from "../ApiScripts";

export default function ProfileScreen() {
  const [newUsername, setNewUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Get user data from params or AsyncStorage
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userID");

        if (params.userId) {
          setUserId(params.userId as string);
        } else if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [params]);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a new username.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const result = await updateUsername(Number(userId), newUsername.trim());
      setLoading(false);

      if (result.success) {
        // Update local storage
        await AsyncStorage.setItem("username", newUsername.trim());
        setNewUsername("");

        Alert.alert("Success", "Username updated successfully!");
      } else {
        Alert.alert("Error", result.error || "Failed to update username");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while updating username.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffd33d" style={styles.loader} />
      ) : (
        <Pressable style={styles.button} onPress={handleUpdateUsername}>
          <Text style={styles.buttonText}>Update Username</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#25292e",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 25,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ffd33d",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
  loader: {
    marginVertical: 20,
  },
  button: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
