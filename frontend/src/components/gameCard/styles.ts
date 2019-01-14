import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";
import {IGameCard} from "./GameCard";

export const Player: StyledElement = styled('p').attrs(
    (props) => ({
        style: {
            color: props.color,
        },
    }),
)`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 20px;
  
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export const Span: StyledElement = styled('span')`
    color: #000;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 16px;
    
    position: absolute;
    bottom: 0;
    right: 10px;
`;

const getBgColor: (props: IGameCard) => string = (props: IGameCard): string => props.state === 'WAITING'
    ? '#97E080'
    : props.state === 'PLAYING'
        ? '#E0DA80'
        : '#D46868';

export const GameCard: StylingFunction = (gameCard: ElementToStyle): StyledElement => styled(gameCard)`
  background-color: ${(props: IGameCard): string => getBgColor(props)};
  height: 150px;
  width: 150px;
  
  position: relative;
  padding: 10px;
  border-radius: 4px;
`;
