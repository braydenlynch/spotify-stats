import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const CLIENT_ID = "79c421b52b86490ba713837ace00cf97"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-read-private"
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
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    window.location.reload()
  }

  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [userImage, setUserImage] = useState("")
  const [userCountry, setUserCountry] = useState("")
  
  const getUserInfo = async () => {
    if(!token) {
      return
    }
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    console.log(data)
    setUserName(data.display_name)
    setUserId(data.id)
    setUserImage(data.images[0].url)
    setUserCountry(data.country)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Stats</h1>
        {!token 
        ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}><button>Login to Spotify</button></a>
        : <>
        <button onClick={logout}>Logout</button>
        <button onClick={getUserInfo}>Get User Info</button>
        <p>{userName}</p>
        <p>{userCountry}</p>
        <img src={userImage} height="100px" width="100px" />
        </>
        }
      </header>
    </div>
  );
}

export default App;
