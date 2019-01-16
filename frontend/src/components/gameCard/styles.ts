import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";
import Span from "../span/Span";

const getBgColor: (state: string) => string = (state: string): string => state === 'WON'
    ? '#aeff64'
    : state === 'DRAW'
        ? '#ffe264'
        : 'transparent';

export const Player: StyledElement = styled('p').attrs(
    (props) => ({
        style: {
            backgroundColor: getBgColor(props.color),
        },
    }),
)` 
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #333;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  padding: 10px;
  
  &:last-child {
    border-radius: 0 0 4px 4px;
    border-bottom: none;
  }
  
  &:first-child {
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #666;
  }
`;

export const PlayersContainer = styled('div')`
  min-height: 121px;
  margin: 5px;
  
  border: 1px solid #666;
  border-radius: 4px;
`;

export const TimeSpan: StyledElement = styled(Span)`
    font-size: 16px;

    display: inline;
    padding: 0;

    position: absolute;
    bottom: 3px;
    right: 10px;
`;

export const GameCard: StylingFunction = (gameCard: ElementToStyle): StyledElement => styled(gameCard)`
  background-color: #fafafa;
  display: block;
  height: 200px;
  width: 200px;
  
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  transition: box-shadow .2s ease-in-out;
  
  position: relative;
  border-radius: 4px;
  
  &:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    cursor: pointer;
  }
`;
