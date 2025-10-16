
// https://sports-betting.herokuapp.com
// pulling data from heroku works now
// v Run the code below in termincal in the project file
// node herokuPull.js

import fetch from "node-fetch";

async function apiCall(url) {
  const res = await fetch(url);
  return res.json();
}

const callGamesByDate = async () => {
  try {
    const json = await apiCall("https://sports-betting-48b2640f3be7.herokuapp.com/api/v1/games");
    console.log("Games:", json);
  } catch (error) {
    console.error("Error:", error);
  }
};

callGamesByDate();