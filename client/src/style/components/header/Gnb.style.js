import styled from 'styled-components';

export const Gnb = styled.nav`
    display: flex;
    align-items: center;
    margin-left: 40px;
    
    ${({ theme }) => theme.tablet`
        display: none;
    `};
`

export const GnbList = styled.ul`
    display: flex;
    align-items: center;
    column-gap: 30px; 

    /* ${({ theme }) => theme.laptop`
        column-gap: 20px;
        max-width: 44.516vw;
        overflow-x: auto;
    `};

    @media (max-width: 850px){
        max-width: 40vw;
    } */
`

export const GnbItem = styled.li`
    position: relative;
    transition: .3s ease-in-out;
    transition-property: color;
    color: var(--text1);
    font-size: 1rem;
    text-transform: uppercase;

    &.disabled{
        color: var(--disabled);

        a {
            cursor: not-allowed;
        }
    }

    &.active{
        color: var(--active); 
        font-weight: 600;
    }

    @media (hover: hover) {
        &:hover:not(.disabled){
            color: var(--active); 
        }
    }
`