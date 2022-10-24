import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const HomeBackground = styled.div`
  background-color: #ffff00;
  height: 100vh;
`;

const Navbar = styled.div`
  width: 80%;
  margin: 0 auto;
  padding-top: 4rem;
`;
const Brand = styled.div`
  font-weight: 800;
  font-size: 1.75rem;
`;

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
const Link = styled(NavLink)`
  background: #000;
  border: 1px solid #000;
  color: #fff;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 4px;
`;

const Home = () => {
  return (
    <HomeBackground>
      <Navbar>
        <Brand>Code Dist</Brand>
      </Navbar>
      <LinkWrapper>
        <Link to="/app">Go to App</Link>
      </LinkWrapper>
    </HomeBackground>
  );
};

export default Home;
