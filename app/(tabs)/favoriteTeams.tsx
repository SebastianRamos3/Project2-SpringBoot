import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { callTeams, getFavorites, removeFavorite, addFavorite} from "../ApiScripts";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import {
  addTeamToFavs,
  removeTeamFromFav,
  getFavTeamNames,
  logDatabaseContents,
} from "../../database/db";

interface Team {
  id: string;
  name: string;
  nickname: string;
  logo: string;
}

const FavoriteTeams = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();//Removed "favoriteTeams" that went after "RootStackParamList" for git debugging purposes
  const username = route.params?.username; // Get username from navigation params
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialize = async () => {
      const userId = route.params?.userId;
      if (!username) {
        console.error("No username received via navigation");
        return;
      }

      setLoading(true);

      try {
        const favTeams = await getFavorites(userId);
        setSelectedTeams((favTeams || []).map((t) => String(t.id)));
        const teamData = await callTeams();
        setTeams(teamData);
        setLoading(false);
      
      } catch (error) {
        console.error("Error fetching teams:", error);
      }

      setLoading(false);
    };

    initialize();
  }, [route.params]);

  const toggleTeamSelection = async (teamId: string, teamName: string) => {
    const userId = route.params?.userId;
    if (!userId) return;

    const already = selectedTeams.includes(teamId);

    if(already){
      const ok = await removeFavorite(userId, teamId);
      if(!ok){
        console.error("Failed to remove favorite on server");
        return;
      }
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    }
    else{
      const ok = await addFavorite(userId, teamId);
      if(!ok){
        console.error("Failed to add favorite on server");
        return;
    }
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favorite Teams</Text>
      {teams.length === 0 ? (
        <Text style={styles.errorText}>No teams available. Check API Key.</Text>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.teamItem,
                selectedTeams.includes(item.name) ? styles.selectedTeam : {},
              ]}
              onPress={() => toggleTeamSelection(item.name)}
            >
              <View style={styles.teamContainer}>
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <Text style={styles.teamText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  teamItem: {
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, marginRight: 10, resizeMode: "contain" },
  selectedTeam: { backgroundColor: "#87CEFA" },
  teamText: { fontSize: 18 },
});

export default FavoriteTeams;