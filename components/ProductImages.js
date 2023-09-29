import styled from "styled-components";
import ModalComponent from "./ModalComponent";
import {useEffect, useState} from "react";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
  
const BigImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
`;

const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    flex-grow: 0;
    margin-top: 10px;
  `;

const ImageButton = styled.div`
    border: 2px solid #ccc;
    ${props => props.$active ? `
      border-color: #ccc;
    ` : `
      border-color: transparent;
    `}
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
  `;

const BigImageWrapper = styled.div`
  text-align: center;
  padding-top: 10px;
  display: grid;
  grid-template-columns: .2fr 1.4fr .2fr;
  align-items: center;
  svg{
      height: 30;
      width: 30;
      cursor: pointer;
      margin: 0px 2px;
  }
`;

export default function ProductImages({images}) {
  const [activeImage,setActiveImage] = useState(images?.[0]);
  const [showModal, setShowModal] = useState(false);
  const [nextImage, setNextImage] = useState();
  const [previousImage, setPreviousImage] = useState();

  useEffect(() => {
    const imagesArr = document.querySelectorAll('div img');
    for(let i = 0; i < imagesArr.length; i++){
      if(imagesArr[i].src === activeImage && i != 0){
        imagesArr[i].click();
      }
    }
  }, [activeImage]
  );

  const focusedImage = (
    <>
      {previousImage ? 
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-1 h-1" 
        onClick={() => {
          const imagesArr = document.querySelectorAll('div img');
          for(let i = 0; i < imagesArr.length; i++){
            if(imagesArr[i].src === previousImage){
              imagesArr[i].click();
            }
          }
        }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg> : <div></div>}
      <BigImage src={activeImage} $previous={previousImage} $next={nextImage} onClick={() => setShowModal(true)}/>
      {nextImage ? 
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-1 h-1" 
        onClick={() => {
          const imagesArr = document.querySelectorAll('div img');
          for(let i = 0; i < imagesArr.length; i++){
            if(imagesArr[i].src === nextImage){
              imagesArr[i].click();
            }
          }
        }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg> : <div></div>}
    </>
  )
  return (
    <div>
      <BigImageWrapper>
      {focusedImage}
      </BigImageWrapper>
      <ImageButtons>
        {images.map((image, index) => {
          let prev = false;
          let next = false;
          
          if(index != 0){
            prev = images[index-1];
          } 
          
          if(index != images.length-1 ){
            next = images[index+1];
          }

          return (
            <ImageButton
              key={image}
              $active={image===activeImage}
              onClick={() => {
                setPreviousImage(prev);
                setNextImage(next);
                setActiveImage(image);
              }}>
              <Image src={image} alt=""/>
            </ImageButton>
          )
        })}
      </ImageButtons>
      {showModal &&
        <ModalComponent 
            onClose={() => setShowModal(false)}>
          {focusedImage}
        </ModalComponent>
      }
    </div>
  );
}