import { ImSpinner2 } from "react-icons/im";
import styled from "styled-components";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.7);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9998;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const SpinnerContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconSpin = styled(ImSpinner2)`
  -webkit-animation: icon-spin 0.3s infinite linear;
  animation: icon-spin 0.3s infinite linear;

  @keyframes icon-spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BackdropWithSpinner = () => {
  return (
    <Container>
      <SpinnerContainer>
        <IconSpin size={50} color="#747373" />
      </SpinnerContainer>
    </Container>
  );
};

export default BackdropWithSpinner;
