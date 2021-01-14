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
    position: absolute;
    background: #000;
    background-image: ${({ colors }) => `linear-gradient(45deg, ${colors})`};
    background-size: 200% 200%;
    animation: gradient 15s ease-in-out infinite alternate;

    @keyframes gradient {
        0% {
            background-position: 0% 100%;
        }
        // 50% {
        //     background-position: 100% 50%;
        // }
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
    console.log(images[`img${idx + 1}`]);

    useEffect(() => {
        // get dominant colors
        // set colors
        const colorGrab = async () => {
            setBgLoaded(false);
            let imgColors = await grabColors(images[`img${idx + 1}`]['file']);
            console.log(imgColors);
            setColors(imgColors);
            setBgLoaded(true);
        };
        colorGrab();
    }, [idx]);

    const nextImg = () => {
        setIdx(idx + 1);
    }

    // return !bgLoaded ? (
    //     <StyledBg></StyledBg>
    // ) : (
    //     <StyledBg colors={colors.join(', ')}>
    //         {/* <img src={images[`img${idx + 1}`]['file']} alt="albumart" onClick={nextImg}/> */}
    //     </StyledBg>
    // );
    return (
        <StyledBg colors={colors.join(', ')}>
            {/* <img src={images[`img${idx + 1}`]['file']} alt="albumart" onClick={nextImg}/> */}
        </StyledBg>
    );
};

export default Background;
