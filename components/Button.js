import styled, {css} from "styled-components";

export const ButtonStyle = css`
    border:0;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight:500;
    svg{
        height: 16px;
        margin-right: 5px;
    }
    ${props => props.$block && css`
        display: block;
        width: 100%;
    `}
    ${props => props.$white && css`
        background-color: #fff;
        color: #000;
        &:hover {
            background-color: #000;
            color: #fff;
        }
    `}
    ${props => props.$black && !props.$disabled && css`
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
        &:hover {
            background-color: #000;
            color: #fff;
        }
    `}
    ${props => props.$black && props.$disabled && css`
        background-color: lightgray;
        color: #000;
        border: 1px solid #000;
        cursor: not-allowed;
    `}
    ${props => props.$red && css`
        background-color: #FF5733;
        color: #fff;
        border: 1px solid #000;
        &:hover {
            background-color: #000;
            color: #fff;
        }
    `}
    ${props => props.$size === 'l' && css`
        font-size:1.2rem;
        padding: 10px 20px;
        svg{
            height: 20px;
        }
    `}
    ${props => props.$width && css`
        width: ${props.$width};
        &:hover {
            background-color: #222;
            color: white;
        }
    `}
    ${props => props.$height && css`
        height: ${props.$height};
        &:hover {
            background-color: #222;
            color: white;
        }
    `}
`;

const StyledButton = styled.button`
    ${ButtonStyle}
`;

export default function Button({children,...rest}) {
    return (
        <StyledButton {...rest}>{children}</StyledButton>
    );
}