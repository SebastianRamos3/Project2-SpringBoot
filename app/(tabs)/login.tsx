import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import loginPic from "../../assets/images/loginPic2.jpg";
import { loginUser } from "../ApiScripts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(username, password);
      setLoading(false);

      if (result.success) {
        const { userId, username: returnedUsername } = result.data;

        // Store user data in AsyncStorage
        await AsyncStorage.setItem("username", returnedUsername);
        await AsyncStorage.setItem("userID", String(userId));
        Alert.alert("Welcome", "You are now logged in!");

        setTimeout(() => {
          router.push({
            pathname: "/favoriteTeams",
            params: {
              userId: Number(userId),
              username: returnedUsername,
            },
          });
        }, 500);
      } else {
        Alert.alert("Error", result.error || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while logging in.");
      console.error(error);
    }
  };

  return (
    <ImageBackground source={loginPic} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "80%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});
