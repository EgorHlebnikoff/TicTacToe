import styled from 'styled-components';
import {StyledElement} from "../../globalStyles";

export const Annotation: StyledElement = styled('h2')`
  --lines-indent: -120px;

  position: relative;

  font-family: "Roboto", sans-serif;
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  color: #7966fd;
  text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5), 3px 6px 10px rgba(238,238,238,0);
  
  &::after, &::before {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    width: 100px;
    background-color: #7966fd;
    
    top: calc(50% - 1px);
  }
  
  &::after {
    left: var(--lines-indent);
  }
  
  &::before {
    right: var(--lines-indent);
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
  
  padding: 60px 0;
  width: 58%;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  background-color: #fafafa;
`;
