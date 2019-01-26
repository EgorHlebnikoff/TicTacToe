import styled from 'styled-components';
import {StyledElement} from "../../globalStyles";

export const Annotation: StyledElement = styled('h2')`
  --font-size: 46px;
  --font-weight: 700;

  position: relative;

  font-family: "Roboto", sans-serif;
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  line-height: 1;
  color: #7966fd;
  text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5), 3px 6px 10px rgba(238,238,238,0);
  text-align: center;
  
  @media (max-width: 840px) {
    --font-size: 36px;
    --lines-width: 80px;
    --lines-indent: -100px;
  }
  
  @media (max-width: 620px) {
    --font-size: 28px;
    --lines-width: 40px;
    --lines-indent: -50px;
  }
  
  @media (max-width: 420px) {
    --font-weight: 500;
    --lines-content: none;
  }
`;

export const Field: StyledElement = styled('div')`
  --grid-gap-size: 10px;

  display: grid;
  grid-gap: var(--grid-gap-size);
  padding: var(--grid-gap-size);
  margin: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  
  border-radius: 10px;
  background-color: #7966fd;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

export const FieldContainer: StyledElement = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  
  padding: 30px 0;
  width: 58%;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  background-color: #fafafa;
  
  @media (max-width: 530px) {
    width: 76%;
  }
`;
