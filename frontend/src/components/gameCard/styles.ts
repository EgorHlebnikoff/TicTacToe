import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";
import {IGameCard} from "./GameCard";

const getTextColor: (state: string) => string = (state: string): string => state === 'WON' ? '#ffe264' : '#333';

export const Player: StyledElement = styled('p').attrs(
    (props) => ({
        style: {
            color: getTextColor(props.color),
        },
    }),
)`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 20px;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  padding: 10px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:first-child {
    border-bottom: 1px solid #666;
  }
`;

export const PlayersContainer = styled('div')`
  min-height: 121px;
  margin: 5px;
  
  border: 1px solid #666;
  border-radius: 4px;
`;

export const Span: StyledElement = styled('span')`
    color: #333;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 18px;
    
    display: block;
    padding: 5px;
`;

export const TimeSpan: StyledElement = styled(Span)`
    font-size: 16px;

    display: inline;
    padding: 0;

    position: absolute;
    bottom: 3px;
    right: 10px;
`;

const getBgColor: (props: IGameCard) => string = (props: IGameCard): string => props.state === 'WAITING'
    ? '#aeff64'
    : props.state === 'PLAYING'
        ? '#64dbff'
        : '#f66d75';

export const GameCard: StylingFunction = (gameCard: ElementToStyle): StyledElement => styled(gameCard)`
  background-color: ${(props: IGameCard): string => getBgColor(props)};
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
