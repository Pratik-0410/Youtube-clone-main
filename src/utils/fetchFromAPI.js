import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  },
};

export const fetchFromAPI = async (url) => {
  try {
    // 🔍 Debug: check if API key is loading
    console.log("API KEY:", process.env.REACT_APP_RAPID_API_KEY);

    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;

  } catch (error) {
    console.error("API ERROR:", error.response || error.message);
    return null;
  }
};
