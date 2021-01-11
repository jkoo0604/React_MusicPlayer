// get image from prop (sent by player)
// get color data for center of image only
// create gradient background using the dominent color

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import grabColors from '../utils/grabColors';
import images from '../utils/images';

const StyledBg = styled.div`
    width: 100%;
    height: 100%;
    background: ${({ colors }) => `linear-gradient(-45deg, ${colors})`};
    background-size: 200% 200%;
    animation: gradient 25s ease infinite;

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    img {
        height: 200px;
    }
`;

const Background = ({ imgId }) => {
    const [loading, setLoading] = useState(true);
    const [colors, setColors] = useState([]);
    console.log(images[`img${imgId + 1}`]);

    useEffect(() => {
        // get dominant colors
        // set colors
        const colorGrab = async () => {
            setLoading(true);
            let imgColors = await grabColors(images[`img${imgId + 1}`]['file']);
            console.log(imgColors);
            setColors(imgColors);
            setLoading(false);
        };
        colorGrab();
    }, [imgId]);

    return loading ? (
        <></>
    ) : (
        <StyledBg colors={colors.join(', ')}>
            <img src={images[`img${imgId + 1}`]['file']} alt="albumart" />
        </StyledBg>
    );
};

export default Background;
