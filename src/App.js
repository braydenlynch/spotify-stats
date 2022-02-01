import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { render } from '@testing-library/react';

function App() {
  // Variables for the API Query, required for getting required access for the app
  const CLIENT_ID = "79c421b52b86490ba713837ace00cf97"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-read-private user-top-read"
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

  // Logout function, sets token to nil and reloads
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    window.location.reload()
  }

  // Preparing variables for getUserInfo
  const [userName, setUserName] = useState("")
  const [userImage, setUserImage] = useState("")
  const [userCountry, setUserCountry] = useState("")

  if(userName && userImage && userCountry) {
    console.log('Logged In')
  } else {
    console.log('Logged Out')
  }
  
  // Gets user information from the Spotify API
  const getUserInfo = async () => {
    if(!token) {
      return
    }
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    setUserName(data.display_name)
    setUserImage(data.images[0].url)
    setUserCountry(data.country)
  }

  // Gets the user info everytime the page is loaded
  useEffect(() => {
    getUserInfo();
  });

  // Load style sheet
  const classes = useStyles();

  // This function retrieves the users top tracks from the Spotify API
  const getUserTopTracks = async () => {
    if(!token) {
      return
    }
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    //console.log(data.items[0])
    let userTopTracks = data.items
    console.log(userTopTracks)
  }

  // This function renders the top tracks as a JSX element, in a grid array
  const RenderUserTopTracks = () => {
    return (
      <div className={classes.topTrackBox}>
        <p>Sugma</p>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Stats</h1>
        {!token 
        ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}><button>Login to Spotify</button></a>
        : <>
        <button onClick={logout}>Logout</button>
        <p>{userName}</p>
        <p>{userCountry}</p>
        <img src={userImage} height="100px" width="100px" />
        <button onClick={getUserTopTracks}>Get Top Tracks</button>
        <RenderUserTopTracks />
        </>
        }
      </header>
    </div>
  );
}

const useStyles = createUseStyles({
  topTrackBox: {
    backgroundColor: 'black',
  },
});

export default App;
