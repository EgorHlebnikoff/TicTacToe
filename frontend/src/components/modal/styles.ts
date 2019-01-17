import styled, {Keyframes, keyframes} from 'styled-components';
import {StyledElement} from "../../globalStyles";

const Show: Keyframes = keyframes`
  0% {
    display: none;
    opacity: 0;
  }
  1% {
    display: flex;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const CloseButton: StyledElement = styled('button')`
  display: block;
  width: 30px;
  height: 30px;
  background-color: #f75757;
  
  padding: 0;
  border: 0;
  border-radius: 4px;
  outline: 0;
  
  transition: background-color .2s ease-in-out, box-shadow .2s ease-in-out;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  
  position: absolute;
  top: 13px;
  right: 13px;
  
  &::before, &::after {
    content: '';
    width: 24px;
    height: 2px;
    background-color: #333;
    
    transition: background-color .2s ease-in-out;
    
    position: absolute;
    top: 14px;
    left: 3px;
  }
  
  &::before {
    transform: rotate(45deg);
  }
  
  &::after {
    transform: rotate(-45deg);
  }
  
  &:hover {
    cursor: pointer;
    background-color: darken(#f75757, .25);
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
    &::before, &::after {
      background-color: #fafafa;
    }
  }
`;

export const ModalTitle: StyledElement = styled('h2')`
  font-size: 22px;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
  color: #333;
`;

export const ModalHeader: StyledElement = styled('div')`
  position: relative;
  width: 100%;
  
  padding: 16px;
  margin-bottom: 50px;
  border-bottom: 1px solid #666;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

export const ModalContent: StyledElement = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
`;

export const Modal: StyledElement = styled('div')`
  max-width: 700px;
  width: 100%;
  padding-bottom: 10px;
  border-radius: 4px;
  
  margin: 0 20px;
  
  background-color: #fff;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  
  @media (max-width: 500px) {
    span, p {
      text-align: center;
    }
  }
`;

export const Backdrop: StyledElement = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  opacity: 1;
  overflow-x: hidden;
  overflow-y: auto;
  
  animation: ${Show} .5s ease-in-out;
`;
