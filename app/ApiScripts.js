const BASE_URL = "https://sports-betting-48b2640f3be7.herokuapp.com"; //I added the url of the backend here

async function getJson(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } 
    catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 1200));
    }
  }
}

export async function callTeams() {
  const json = await getJson(`${BASE_URL}/api/teams`);
  if (!Array.isArray(json)) return [];
  return json
    .filter(t => t.nbaFranchise === true)
    .map(t => ({ id: String(t.id), name: t.name, nickname: t.nickname, logo: t.logo }));
}
//I added this function to get the favorite teams of a user from the backend
export async function getFavorites(userId) {
  const url = `${BASE_URL}/api/v1/users/${userId}/favorites`;
  try {
    const json = await getJson(url);
    console.log("getFavorites:", url, json);
    return Array.isArray(json)?json : [];
  } 
  catch (e) {
    console.error("getFavorites error:", e);
    return [];
  }
}
// I still need to add the function to add and remove favorite teams which are post and delete requests

export async function addFavorite(userId, teamId) {
  // include teamId as query param to match backend @RequestParam Long teamId
  const url = `${BASE_URL}/api/v1/users/${userId}/favorites?teamId=${Number(teamId)}`;
  try {
    const res = await fetch(url, { method: "POST" });
    const text = await res.text();
    console.log("addFavorite request:",url, "status:", res.status,"body:", text);
    return res.ok;
  } 
  catch (e) {
    console.error("addFavorite error:", e);
    return false;
  }
}

export async function removeFavorite(userId, teamId) {
  const url = `${BASE_URL}/api/v1/users/${userId}/favorites/${teamId}`;
  try {
    const res = await fetch(url, { method: "DELETE" });
    const text = await res.text();
    console.log("removeFavorite request:", url, "status:", res.status,"body:", text);
    return res.ok;
  } 
  catch (e){
    console.error("removeFavorite error:", e);
    return false;
  }
}



export async function registerUser(username, password, email) {
  const url = `${BASE_URL}/api/users/register`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    });
    
    // Check if response is ok before trying to parse JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("registerUser HTTP error:", res.status, errorText);
      return { success: false, error: `Server error: ${res.status}` };
    }
    
    // Check if response has content-type application/json
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error("registerUser non-JSON response:", responseText);
      return { success: false, error: "Server returned non-JSON response" };
    }
    
    const data = await res.json();
    return { success: true, data: data };
    
  } catch (e) {
    console.error("registerUser error:", e);
    return { success: false, error: "Network error" };
  }
}

export async function loginUser(username, password) {
  const url = `${BASE_URL}/api/users/login`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    // Check if response is ok before trying to parse JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("loginUser HTTP error:", res.status, errorText);
      
      // Handle specific error codes
      if (res.status === 503) {
        return { success: false, error: "Server is temporarily unavailable. Please try again later." };
      } else if (res.status === 500) {
        return { success: false, error: "Internal server error. Please try again." };
      } else if (res.status === 400) {
        return { success: false, error: "Invalid username or password." };
      } else {
        return { success: false, error: `Server error: ${res.status}` };
      }
    }
    
    // Check if response has content-type application/json
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error("loginUser non-JSON response:", responseText);
      return { success: false, error: "Server returned non-JSON response" };
    }
    
    const data = await res.json();
    return { success: true, data: data };
    
  } catch (e) {
    console.error("loginUser error:", e);
    return { success: false, error: "Network error" };
  }
}

export async function updateUsername(userId, newUsername) {
  const url = `${BASE_URL}/api/users/${userId}/username`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername
      })
    });
    
    // Check if response is ok before trying to parse JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("updateUsername HTTP error:", res.status, errorText);
      return { success: false, error: `Server error: ${res.status}` };
    }
    
    // Check if response has content-type application/json
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error("updateUsername non-JSON response:", responseText);
      return { success: false, error: "Server returned non-JSON response" };
    }
    
    const data = await res.json();
    return { success: true, data: data };
    
  } catch (e) {
    console.error("updateUsername error:", e);
    return { success: false, error: "Network error" };
  }
}

export async function callGamesByDate(teamID, startDate, endDate) {
  // --- Hardcoded mock data ---
  const mockGames = [
    {
      id: "1",
      date: new Date("2025-11-02"),
      homeTeam: {
        name: "Los Angeles Lakers",
        nickname: "Lakers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
      },
      awayTeam: {
        name: "Golden State Warriors",
        nickname: "Warriors",
        logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
      },
    },
    {
      id: "2",
      date: new Date("2025-11-05"),
      homeTeam: {
        name: "Boston Celtics",
        nickname: "Celtics",
        logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
      },
      awayTeam: {
        name: "Miami Heat",
        nickname: "Heat",
        logo: "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
      },
    },
    {
      id: "3",
      date: new Date("2025-11-07"),
      homeTeam: {
        name: "Chicago Bulls",
        nickname: "Bulls",
        logo: "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg",
      },
      awayTeam: {
        name: "New York Knicks",
        nickname: "Knicks",
        logo: "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg",
      },
    },
  ];

  // Filter by teamID if desired (so Lakers show only Lakers’ games, etc.)
  const filtered = mockGames.filter(
    (g) =>
      g.homeTeam.name.toLowerCase().includes(teamID) ||
      g.awayTeam.name.toLowerCase().includes(teamID)
  );

  // Return filtered or full list if nothing matches
  return filtered.length > 0 ? filtered : mockGames;
}