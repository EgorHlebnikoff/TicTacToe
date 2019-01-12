import * as React from "react";
import styled from "styled-components";

export const Title = styled('h1')`
    font-size: 82px;
    color: #fedfed;
    font-weight: 600;
    font-family: 'Roboto', sans-serif;
    
    @media (max-width: 500px) {
        font-size: 40px;
    }
`;

export const styleHeader = (header: React.ComponentType<any>) => styled(header)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 20px;
`;
