import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const Point = styled.div`
    width: 28px;
    height: 28px;
    background-color: white;
    border: 1px solid; 
    border-color: ${COLORS.light_gray}; 
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 4; 
`

function UnActivePoint() {

    return (
        <Container>
            <Point>
            </Point>
        </Container>
    );
}

export default ActivePoint;
