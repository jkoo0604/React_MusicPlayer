// import background and visualizer
// pick random image pass into background and visualizer as album image
// send track info to visualizer
// create final player  with controls
// usestate to create playlist (start with 0)

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Background from './Background';
import Visualizer from './Visualizer';
import musicInfo from '../utils/musicInfo';

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    // width: calc(100vw);
    // min-height: calc(100vh);
    position: relative;
`;

const Player = () => {
    const [idx, setIdx] = useState(0);
    const [autoplay, setAutoplay] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);
    const trackCount = musicInfo.length;

    return (
        <StyledContainer>
            {
                idx === -1 ? <></> : <>
                <Background idx={idx} setIdx={setIdx} bgLoaded={bgLoaded} setBgLoaded={setBgLoaded} />
            <Visualizer
                idx={idx}
                setIdx={setIdx}
                autoplay={autoplay}
                setAutoplay={setAutoplay}
                bgLoaded={bgLoaded}
                trackCount={trackCount}
            /></>
            }
        </StyledContainer>
    );
};

export default Player;
