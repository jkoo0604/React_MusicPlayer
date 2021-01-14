import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import grabColors from '../utils/grabColors';
import images from '../utils/images';

const StyledBg = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    background-image: ${({ colors }) => `linear-gradient(45deg, ${colors})`};
    background-size: 200% 200%;
    animation: gradient 8s ease-in-out infinite alternate;

    @keyframes gradient {
        0% {
            background-position: 0% 100%;
        }
        100% {
            background-position: 100% 0%;
        }
    }
    @keyframes gradient2 {
        0% {
            background-size: 100% 100%;
            background-position: 0% 0%;
        }
        100% {
            background-size: 200% 200%;
            background-position: 50% 50%;
        }
    }

    img {
        height: 200px;
    }
`;

const Background = ({ idx, setIdx, bgLoaded, setBgLoaded }) => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        const colorGrab = async () => {
            setBgLoaded(false);
            let imgColors = await grabColors(images[`img${idx + 1}`]['file']);
            setColors(imgColors);
            setBgLoaded(true);
        };
        colorGrab();
    }, [idx, setBgLoaded]);

    return <StyledBg colors={colors.join(', ')} />;
};

export default Background;
