
import './App.css';
import styled from 'styled-components';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import Footer from "./components/footer"
import img from "./media/goldengate.jpeg";
import jwt_decode from "jwt-decode";

//645495613444-69mmud7u5afbdhe401nvb42ctg9ocd75.apps.googleusercontent.com
//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

export const API_KEY = "a9118a3a";

const Logo = styled.img`
  height: 60px;
  width: 300px;
  /* margin-right: 20px; */
  margin-bottom: 20px;
  margin-top: 40px`
  
  ;

  const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
`;


const TopRight = styled.div`
  display: flex;
  flex-direction: row;
  margin-left:auto;
  
  font-size: medium;
  color: black;
  align-items: right;
  margin-right:15px;
  

  
`;

const Header = styled.div`
  /* background-color: black; */
  background-image: url(${img}) ;
  background-position:center;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  font-size: 40px;
  font-weight: bold;
  /* box-shadow: 0 3px 6px 0 #555; */
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
  border-width: 10px;
  outline: 10px;
  border: solid;
  margin-bottom: 40px;
  margin-top: 20px;
  /* margin-right:55px; */
  
  
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 24px;
  /* font-weight: bold; */
  border: none;
  outline: none;
  margin-left: 15px;
  width: calc(100% - 20px);
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

const Empty = styled.div``;
function App() {

  const [searchQuery, updateSearchQuery] = useState("");
  const [user, setUser] = useState()
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`,
    );
    updateMovieList(response.data.Search);
  };

  const logOut = () =>{
    
    console.log("Logged out");
    /* document.getElementById("signInDiv").hidden = false;  */
    setUser();
    alert("Logged out successfully");
  };

  const onTextChange = (e) => {
    onMovieSelect("")
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  React.useEffect(()=> onInit(), []);
  const onInit = () =>{
   
    setTimeout(() => fetchData("fast"), 500);
    
  }

  function handleCallbackResponse(response){
    console.log("encoded jwt token", jwt_decode(response.credential));
    setUser(jwt_decode(response.credential));
    /* document.getElementById("signInDiv").hidden = true;  */
  }
  /* global google */
  useEffect(() => {
  google.accounts.id.initialize({
    client_id: "645495613444-69mmud7u5afbdhe401nvb42ctg9ocd75.apps.googleusercontent.com",
    callback: handleCallbackResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    {theme: "outline", size: "large"}
  );


}, []);
  

 
  return (
    
<Container>
      <Header>
      
      <TopRight>
      {(!user || user=={}) && <div id="signInDiv"></div>}
      {user && <div id="logged"><div className="welcome">Welcome Back, {user.name.split(" ")[0]}</div><button onClick={logOut}><img id="icon" src={user.picture}></img></button></div>}
      </TopRight>
      <Logo src="/geoidentity.png"/>
      
      {/* <AppName>Video Search</AppName> */}
      
      
      <SearchBox><SearchIcon src="/search.png"/><SearchInput placeholder="Search" value={searchQuery}
            onChange={onTextChange}/></SearchBox>
     
      </Header>
      
      {selectedMovie && <MovieInfoComponent selectedMovie={selectedMovie} onMovieSelect={onMovieSelect}/>}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/search.png" />
        )}
      </MovieListContainer>
      <Footer />
      </Container>
   
    
  );
}

export default App;
