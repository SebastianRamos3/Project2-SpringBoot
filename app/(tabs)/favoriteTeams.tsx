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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { callTeams } from "../ApiScripts";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import { addTeamToFavs, removeTeamFromFav } from "../../database/db";

interface Team {
  id: string;
  name: string;
  nickname: string;
  logo: string;
}

const FavoriteTeams = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();//Removed "favoriteTeams" that went after "RootStackParamList" for git debugging purposes
  const username = route.params?.username; // Get username from navigation params
  const userId = route.params?.userId;

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!userId) {
        console.error("No userId received via navigation");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const teamData = await callTeams();
        setTeams(teamData);

        const favs = await getFavorites(userId);
        const ids = Array.isArray(favs) ? favs.map((t: any) => String(t.id)) : [];
        setSelectedTeamIds(ids);
      } 
      catch (e) {
        console.error("Error initializing favorites screen:", e);
      } 
      finally {
        setLoading(false);
      }
    };
    initialize();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  const toggleTeamSelection = async (teamId: string, teamName?: string) => {
    if (!userId){
      return;
    }
    const already = selectedTeamIds.includes(teamId);

    try{
      if (already){
        const ok = await removeFavorite(userId, teamId);
        if (ok){
          setSelectedTeamIds(prev => prev.filter(id => id !== teamId));
          if (username) {
            try { 
              await removeTeamFromFav(username, teamName || ""); 
            } 
            catch (e) { 
              console.warn("Local DB remove failed:", e); 
            }
          }
        }
      } 
      else {
        const ok = await addFavorite(userId, teamId);
        if(ok) {
          setSelectedTeamIds(prev => [...prev, teamId]);
          if (username) {
            try { await addTeamToFavs(username, teamName || ""); } catch (e) { console.warn("Local DB add failed:", e); }
          }
        }
      }
    } 
    catch (e) {
      console.error("Favorite toggle failed:", e);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favorite Teams</Text>
      {teams.length === 0 ? (
        <Text style={styles.errorText}>No teams available from backend.</Text>
      ) :(
        <FlatList
          data={teams}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const selected = selectedTeamIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.teamItem, selected && styles.selectedTeam]}
                onPress={() => toggleTeamSelection(item.id, item.name)}>
                <View style={styles.teamContainer}>
                  <Image source={{uri:item.logo}} style={styles.logo}/>
                  <Text style={styles.teamText}>{item.name}</Text>
                </View>
              </TouchableOpacity> );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff"},
  title: { fontSize: 20, fontWeight:"bold", marginBottom: 10},
  loader: { flex: 1, justifyContent: "center", alignItems: "center"},
  errorText: { fontSize: 16,color: "red", textAlign: "center"},
  teamItem:{
    padding: 15, 
    marginBottom: 5, 
    borderWidth: 1, 
    borderColor: "#ddd",
    borderRadius: 5, 
    flexDirection: "row", 
    alignItems: "center",
  },
  teamContainer:{ 
    flexDirection: "row", 
    alignItems: "center" 
  },
  logo: { 
    width: 40, 
    height: 40, 
    marginRight: 10, 
    resizeMode: "contain" 
  },
  selectedTeam: { backgroundColor: "#87CEFA" },
  teamText: { fontSize: 18 },
});

export default FavoriteTeams;