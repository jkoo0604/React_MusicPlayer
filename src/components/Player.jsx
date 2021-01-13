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
    width: calc(100vw);
    height: calc(100vh);
`;

const Player = () => {
    const [idx, setIdx] = useState(1);
    const trackCount = musicInfo.length;

    return (
        <StyledContainer>
            {
                idx === -1 ? <></> : <>
                <Background idx={idx} setIdx={setIdx} />
            <Visualizer
                idx={idx}
                setIdx={setIdx}
                trackCount={trackCount}
            /></>
            }
        </StyledContainer>
    );
};

export default Player;
