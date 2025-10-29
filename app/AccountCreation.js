import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { registerUser } from "./ApiScripts"; 
import accountPic from "../assets/images/accountCreationPic.jpg"; // Your background image
import { useRouter } from "expo-router"; // Import the useRouter hook

const AccountCreation = () => {
  // State to store the values of the form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter(); // Access the router object

  // Handle account creation logic
  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      // Call backend API to register user
      const result = await registerUser(username, password, email);
      
      if (result.success) {
        Alert.alert("Account Created", `Welcome, ${username}!`);
        router.push("/login");
        
        // Reset form fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      Alert.alert("Error", "An error occurred while creating the account.");
    }
  };

  return (
    <ImageBackground
      source={accountPic}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button title="Create Account" onPress={handleCreateAccount} />


        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Button
            title="Login"
            onPress={() => router.push("/login")} // Navigate to the Login screen
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for form
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default AccountCreation;
