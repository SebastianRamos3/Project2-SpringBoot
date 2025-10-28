const BASE_URL = "https://sports-betting-48b2640f3be7.herokuapp.com"; //I added the url of the backend here

export const apiCall = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844",
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const callTeams = async () => {
  try {
    const json = await apiCall(`${BASE_URL}/api/teams`, true);

    if (!json || !Array.isArray(json)) {
      throw new Error("Invalid API response");
    }
    const teamData = json
      .filter((team) => team.nbaFranchise === true)
      .map((team) => ({
        id: team.id,
        name: team.name,
        nickname: team.nickname,
        logo: team.logo,
      }));

    return teamData;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
  };
  //I added this function to get the favorite teams of a user from the backend
export const getFavorites = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/${userId}/favorites`);
    if (!res.ok){
      throw new Error(`Failed to fetch favorites: ${res.status}`);
    }
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } 
  catch (err){
    console.error("Error fetching favorites:", err);
    return [];
  }
};

export const addFavorite = async (userId, teamId) => {
  try{
    const res = await fetch(`${BASE_URL}/api/v1/users/${userId}/favorites?teamId=${teamId}`, {
      method: "POST",});
      return res.ok;
  }
  catch(err){
    console.error("Error adding favorite:", err);
    return false;
  }
};

export const removeFavorite = async (userId, teamId) => {
  try{
    const res = await fetch(`${BASE_URL}/api/v1/users/${userId}/favorites/${teamId}`, {
      method: "DELETE",});
      return res.ok;
  }
  catch(err){
    console.error("Error removing favorite:", err);
    return false;
  }
};

// I still need to add the function to add and remove favorite teams which are post and delete requests

export const callGamesByDate = async (startDate, endDate, teamID) => {
  try {
    const json = await apiCall(
      `https://api-nba-v1.p.rapidapi.com/games?league=standard&season=2024&team=${teamID}`
    );
    if (!json || !json.response) {
      throw new Error("Invalid API response");
    }
    // Filter games based on the provided date range. It was a lot easier to filter out games outside the range
    // than to select each date in the range and check.
    // this also prevents having to check if there is a game on a specific date
    const gameData = json.response
      .filter((game) => {
        const gameDate = new Date(game.date.start);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return gameDate >= start && gameDate <= end;
      })
      // I think I could make call Teams redundant with this stuff at some point.
      .map((game) => ({
        id: game.id,
        date: new Date(game.date.start),
        homeTeam: {
          id: game.teams.home.id,
          name: game.teams.home.name,
          nickname: game.teams.home.nickname,
          logo: game.teams.home.logo,
        },
        awayTeam: {
          id: game.teams.visitors.id,
          name: game.teams.visitors.name,
          nickname: game.teams.visitors.nickname,
          logo: game.teams.visitors.logo,
        },
      }));
    return gameData; // Return the filtered and mapped game data
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};