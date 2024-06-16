import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 10px;
    padding: 2rem;
    width: 300px;
    position: relative;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`;

const Modal = ({ isOpen, onClose, title, children }) => (
    <ModalBackground isOpen={isOpen}>
        <ModalContent>
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <h2>{title}</h2>
            {children}
        </ModalContent>
    </ModalBackground>
);

export default Modal;
