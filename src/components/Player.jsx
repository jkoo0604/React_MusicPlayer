// import background and visualizer
// pick random image pass into background and visualizer as album image
// send track info to visualizer
// create final player  with controls
// usestate to create playlist (start with 0)

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Background from './Background';
import Visualizer from './Visualizer';
import images from '../utils/images';
import musicInfo from '../utils/musicInfo';

const StyledContainer = styled.div`
    width: calc(100vw);
    height: calc(100vh);
`;

const Player = () => {
    const [trackId, setTrackId] = useState(0);
    const [imgId, setImgId] = useState(0);
    const imgCount = Object.values(images).length;
    const trackCount = musicInfo.length;

    useEffect(() => {
        // let idx = Math.floor(Math.random() * (imgCount + 1));
        setImgId(trackId);
    }, [trackId, imgCount]);

    return (
        <StyledContainer>
            <Background imgId={imgId} />
            <Visualizer
                trackId={trackId}
                setTrackId={setTrackId}
                imgId={imgId}
                trackCount={trackCount}
            />
        </StyledContainer>
    );
};

export default Player;
