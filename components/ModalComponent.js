import styled from "styled-components";
import React, { useRef, useEffect } from "react";

const ModalWrapper = styled.div`
    max-width: 800px;
    max-height: 600px;
`;

const Modal = styled.div`
    background: white;
    height:100%;
    width:100%;
    border-radius: 15px;
    padding: 15px;
`;
  
const ModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;
  
const ModalBody = styled.div`
    padding-top: 10px;
    display: grid;
    grid-template-columns: .1fr 1.5fr .1fr;
    align-items: center;
    svg{
        height: 40px;
        width: 40px;
        cursor: pointer;
        margin: 0px 2px;
    }
    img{
        height: 100%;
        width: 100%;
    }
`;
  
const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    svg{
        margin-top: 5px;
        height: 30px;
        width: 30px;
        cursor: pointer;
    }
`;

export default function ModalComponent({ onClose, children, title }) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    onClose();
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    return (
        <ModalOverlay>
            <ModalWrapper>
                <Modal ref={wrapperRef}>
                    <ModalHeader>
                        <h1>{title ? title : ""}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={handleCloseClick}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                </Modal>
            </ModalWrapper>
        </ModalOverlay>
    );
};