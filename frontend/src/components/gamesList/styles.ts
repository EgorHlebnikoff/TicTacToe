import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const StyledGamesList: StylingFunction = (item: ElementToStyle): StyledElement => styled(item)`
  --item-width: 150px;
  --grid-columns: 6;
  --grid-gap-size: 10px;
  
  --items-width-sum: calc(var(--item-width) * var(--grid-columns));
  --indents-sum: calc(var(--grid-gap-size) * (var(--grid-columns) - 1));
  --container-width: calc(var(--items-width-sum) + var(--indents-sum));

  display: grid;
  grid-gap: var(--grid-gap-size);
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  width: var(--container-width);
  
  @media (max-width: 980px) {
    --grid-columns: 5;
  }
  
  @media (max-width: 820px) {
    --grid-columns: 4;
  }
  
  @media (max-width: 660px) {
    --grid-columns: 3;
  }
  
  @media (max-width: 500px) {
    --grid-columns: 2;
  }
  
  @media (max-width: 340px) {
    --grid-columns: 1;
  }
`;

export default StyledGamesList;
