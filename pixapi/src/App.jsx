import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

const App = () => {
  const [inputs, setInputs] = useState({
    search: "",
    limit: 10,
    rating: "g",
  });

  const [currentGif, setCurrentGif] = useState([]);
  const [bannedWords, setBannedWords] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);



  useEffect(() => {
    const words = localStorage.getItem("bannedWords");
    if (words) {
      setBannedWords(JSON.parse(words));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bannedWords", JSON.stringify(bannedWords));
  }, [bannedWords]);

  useEffect(() => {
    const searches = localStorage.getItem("recentSearches");
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const makeQuery = async () => {

    // if banned words are in the search, alert the user and return
    if (bannedWords.some((word) => inputs.search.toLowerCase().includes(word.toLowerCase()))) {
      alert("Banned word detected, please try again");
      return;
    }

    const query = `https://api.giphy.com/v1/gifs/search?api_key=${ACCESS_KEY}&q=${inputs.search}&limit=${inputs.limit}&rating=${inputs.rating}&lang=${inputs.lang}`;
    try {
      const response = await axios.get(query);
      const { data } = response;
      if (data.data.length === 0) {
        alert("No results found, please try again");
      } else {
        setCurrentGif(
          data.data
            .filter((gif) =>
              !bannedWords.some((word) =>
                gif.title.toLowerCase().includes(word.toLowerCase())
              )
            )
            .map((gif) => gif.images.original.url)
        );
        resetInputs();
        if (!recentSearches.includes(inputs.search)) {
          setRecentSearches((prevState) => [inputs.search, ...prevState]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetInputs = () => {
    setInputs((prevState) => ({
      ...prevState,
      limit: 10,
      rating: "g",
    }));
  };

  const handleInputChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const limitChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      limit: event.target.value,
    }));
  };

  const ratingChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      rating: event.target.value,
    }));
  };

  const banWord = (word) => {
    setBannedWords((prevState) => [...prevState, word]);
  };

  const gifDisplay = () => {
    if (currentGif.length > 0) {
      return (
        <div className="gif-list">
          {currentGif.map((gif, index) => (
            <img
              key={index}
              src={gif}
              alt="gif"
              className="gif m-2 rounded-md shadow-md"

            />
          ))}
        </div>
      );
    }
  };

 

  const recentSearchesDisplay = () => {
    if (recentSearches.length > 0) {
      return (
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>{search}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  const [isBannedWordsDisplay, setIsBannedWordsDisplay] = useState(false);

  const toggleBannedWordsDisplay = () => {
    setIsBannedWordsDisplay(!isBannedWordsDisplay);
  }
  
  const bannedWordsDisplay = () => {
    if (isBannedWordsDisplay) {
      return (
        <div className="banned-words">
          <h3>Banned Words</h3>
          <ul>
            {bannedWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      );
    }
  }



  return (
    <div className="flex">
  <div className="w-1/3 p-4 bg-slate-200">
    <h1 className="text-3xl font-bold mb-4">Giphy Search</h1>
    <div className="mb-4">
      <input
        type="text"
        name="search"
        value={inputs.search}
        onChange={handleInputChange}
        placeholder="Search"
        className="border border-gray-400 p-1 m-2 py-2 m-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
      />
      <button onClick={makeQuery} className="bg-gray-300 text-gray-800 p-1 m-2 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-indigo-500
      ">Search</button>
    </div>
    <div className="mb-4">
      <button onClick={resetInputs} className="bg-gray-300 text-gray-800 p-1 m-2 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-indigo-500">Reset</button>
      <button onClick={toggleBannedWordsDisplay} className="bg-gray-300 text-gray-800 p-1 m-2 py-2 ml-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-indigo-500">Banned Words</button>
    </div>
    {bannedWordsDisplay()}
    <div className="mb-4">
      <input
        type="text"
        name="banWord"
        value={inputs.banWord}
        onChange={handleInputChange}
        placeholder="Ban Word"
        className="border border-gray-400   py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
      />
      <button onClick={() => banWord(inputs.banWord)} className="bg-indigo-500 text-white p-1 m-2 py-2 ml-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500">Ban Word</button>
    </div>
    <div className="mb-4">
      <label htmlFor="limit" className="mr-2 font-bold">Limit</label>
      <select name="limit" value={inputs.limit} onChange={limitChange} className="border border-gray-400 p-1 m-2 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500">
        <option value="1">1</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
      <label htmlFor="rating" className="ml-4 mr-2 font-bold">Rating</label>
      <select name="rating" value={inputs.rating} onChange={ratingChange} className="border border-gray-400 p-1 m-2 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500">
        <option value="g">G</option>
        <option value="pg">PG</option>
        <option value="pg-13">PG-13</option>
        <option value="r">R</option>
      </select>
    </div>
    {recentSearchesDisplay()}
  </div>
  <div className="flex-1 grid grid-cols-3 gap-4 p-4">
    {gifDisplay()}
  </div>
</div>


  );
};

export default App;
