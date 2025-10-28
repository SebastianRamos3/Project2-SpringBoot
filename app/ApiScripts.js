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