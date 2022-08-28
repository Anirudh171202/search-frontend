
import './App.css';
import styled from 'styled-components';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import Search from "./components/search";
import MeiliSearch from "meilisearch";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700/",
});

const index = client.getIndex("movies");

export const API_KEY = "a9118a3a";

const Logo = styled.img`
  height: 40px;
  width: 150px;
  margin-right: 20px;
  margin-bottom: 8px;`
  ;

  const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px; 

`;

const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto; 
margin-right: 45vw;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
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
  // font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
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

function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`,
    );
    updateMovieList(response.data.Search);
  };

  const onTextChange = (e) => {
    onMovieSelect("")
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };
  return (
<Container>
      <Header><Logo src="/geoidentity.png"/><AppName>Video Search</AppName>
     
      </Header>
      <SearchContainer>
      {/* <Search /> */}
      <SearchBox><SearchIcon src="/search.png"/><SearchInput placeholder="Search" value={searchQuery}
            onChange={onTextChange}/></SearchBox>
      </SearchContainer>
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
      </Container>
   
    
  );
}

// function App() {
//   const [searchedWord, setSearch] = useState("");
//   const [resultSearch, setResults] = useState([]);
//   const [resultCards, setCards] = useState([]);

//   useEffect(() => {
//     // Create an scoped async function in the hook
//     async function searchWithMeili() {
//       const search = await index.search(searchedWord);
//       console.log(search);
//       setResults(search.hits);
//     }
//     // Execute the created function directly
//     searchWithMeili();
//   }, [searchedWord]);

//   useEffect(() => {
//     let arrayItems = [];
//     for (let i = 0; i < resultSearch.length; i++) {
//       const product = resultSearch[i];
//       arrayItems.push(
//         <div class="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-3">
//           <a
//             href={product.url}
//             class="flex-1 rounded overflow-hidden shadow-lg"
//           >
//             <img
//               class="w-full h-48 object-cover"
//               src={product.images}
//               alt={product.name}
//               onError={(e)=>{e.target.onerror = null; e.target.src="/wide_logo.png"}}
//             />
//             <div class="px-6 py-3">
//               <div class="font-bold text-sm mb-1 text-gray-600 capitalize">
//                 {product.category}
//               </div>
//               <div class="font-bold text-xl mb-2 text-gray-800">
//                 {product.vendor} - {product.name.substr(0, 20)}
//               </div>
//               <p class="text-black text-xl font-bold text-base py-2">
//                 $ {product.price}
//               </p>
//             </div>
//           </a>
//         </div>
//       );
//     }
//     setCards(arrayItems);
//   }, [resultSearch]);

//   return (
//     <div className="mx-auto">
//       <div class="header font-sans text-white items-center justify-center">
//         <header class="py-12">
//           <img
//             class="h-20 w-auto items-center justify-center p-2 mx-auto"
//             src="/wide_logo.png"
//             style={{ filter: "invert(0%)" }}
//             alt=""
//           />
//           <h1 class="flex flex-wrap flex-grow text-3xl w-full justify-center p-4">
//             Stop looking for an item — find it and work hard!
//           </h1>
//           <div class="border rounded overflow-hidden w-full flex justify-center mx-auto searchBox mt-6">
//             <button class="flex items-center justify-center px-4 shadow-md bg-white text-black">
//               <svg
//                 class="h-4 w-4 text-grey-dark"
//                 fill="currentColor"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
//               </svg>
//             </button>
//             <input
//               type="text"
//               value={searchedWord}
//               onChange={(event) => setSearch(event.target.value)}
//               class="px-6 py-4 w-full text-black"
//               placeholder="Product, sport, color, …"
//             />
//           </div>
//         </header>
//       </div>
//       <div>
//         <div class="flex flex-wrap searchResults">{resultCards}</div>
//       </div>
//     </div>
//   );
// }

export default App;
