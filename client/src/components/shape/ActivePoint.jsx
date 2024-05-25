import React from 'react';
import styled from 'styled-components';
import { COLORS } from "../../styles/colors"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const OutCircle = styled.div`
    width: 24px;
    height: 24px;
    background-color: ${COLORS.sky_blue};
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 3; 
`

const InnerCircle = styled.div`
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 4; 
`

function ActivePoint() {

    return (
        <Container>
            <OutCircle>
                <InnerCircle />
            </OutCircle>
        </Container>
    );
}

export default ActivePoint;
