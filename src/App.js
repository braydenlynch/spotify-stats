import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const CLIENT_ID = "79c421b52b86490ba713837ace00cf97"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")
  
    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
  
        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
  
    setToken(token)
  
    getUserInfo()
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [userImage, setUserImage] = useState("")
  const getUserInfo = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    console.log(data)
    setUserName(data.display_name)
    setUserId(data.id)
    setUserImage(data.images[0].url)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Stats</h1>
        {!token 
        ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        : <button onClick={logout}>Logout</button>
        }
        <p>{userName}</p>
        <p>{userId}</p>
        <p>{userImage}</p>
      </header>
    </div>
  );
}

export default App;
