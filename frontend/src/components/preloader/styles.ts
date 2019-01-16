import styled, {Keyframes, keyframes} from "styled-components";
import {StyledElement} from "../../globalStyles";

const loaderSize: string = '100px';
const checkColor: string = '#7966fd';
const checkHeight: string = (parseInt(loaderSize, 10) / 2).toString() + 'px';
const checkWight: string = (parseInt(checkHeight, 10) / 2).toString() + 'px';

const LoaderSpin: Keyframes = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);} 
`;

const Checkmark: Keyframes = keyframes`
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: ${checkWight};
    opacity: 1;
  }
  40% {
    height: ${checkHeight};
    width: ${checkWight};
    opacity: 1;
  }
  100% {
    height: ${checkHeight};
    width: ${checkWight};
    opacity: 1;
  }
`;

export const PreloaderCheckmark: StyledElement = styled('div')`
  display: none;
  
  --check-height: ${checkHeight};
  --check-width: ${checkWight};
  --check-color: ${checkColor};
  --check-left: calc(calc(${loaderSize} / 6) + calc(${loaderSize} / 12));
  --check-thikness: 3px;
  
  &.draw {
    display: block;
    
    &::after {
      transform: scaleX(-1) rotate(135deg);
      animation: ${Checkmark} .8s ease-in-out;  
    }
  }
  
  &::after {
    content: '';
    height: var(--check-height);
    width: var(--check-width);
    
    position: absolute;
    left: var(--check-left);
    top: var(--check-height);
    
    transform-origin: left top;
    border-right: var(--check-thikness) solid var(--check-color);
    border-top: var(--check-thikness) solid var(--check-color);
    opacity: 1;
  }
`;

export const Preloader: StyledElement = styled('div')`
  --loader-size: ${loaderSize};
  --check-color: ${checkColor};
  
  display: inline-block;
  width: var(--loader-size);
  height: var(--loader-size);
  position: relative;

  margin: 36px auto calc(var(--loader-size) / 2) auto;
  vertical-align: top;
  
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left-color: var(--check-color);
  border-radius: 50%;
  
  animation: ${LoaderSpin} 1.2s infinite linear;
  
  &.isComplete {
    animation: none;
    border-color: var(--check-color);
    transition: border .5s ease-in-out;
  }
`;
