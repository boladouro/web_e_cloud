import {SearchBar} from "../Components/SearchBar.tsx";
import styled from "styled-components";


const HomeSearchBar = styled(SearchBar)`
  width: 700px;
  max-width: 100%;
`;

const HomeH1 = styled.h1`
  margin-bottom: 1em;
  font-weight: 700;
  font-size: 2em;
  line-height: 1.125em;
`;


function Home() {
  return <>
    <div className={"flex flex-items-center flex-justify-center min-h-400px p16px"}>
      <HomeH1>Welcome to the home page!</HomeH1>
      <HomeSearchBar />
    </div>
  </>
}

export default Home