import React, { useState } from 'react';
import styled from 'styled-components';

import Background from './Background';
import Visualizer from './Visualizer';
import musicInfo from '../utils/musicInfo';

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const CreditsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const CreditsDiv = styled.div`
    font-size: 12px;
    z-index: 5;
    margin: 0px 8px;
    color: rgba(255, 255, 255, 0.4);

    a {
        color: rgba(255, 255, 255, 0.4);
    }
`;

const Player = () => {
    const [idx, setIdx] = useState(0);
    const [autoplay, setAutoplay] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);
    const trackCount = musicInfo.length;

    return (
        <StyledContainer>
            <Background
                idx={idx}
                setIdx={setIdx}
                bgLoaded={bgLoaded}
                setBgLoaded={setBgLoaded}
            />
            <Visualizer
                idx={idx}
                setIdx={setIdx}
                autoplay={autoplay}
                setAutoplay={setAutoplay}
                bgLoaded={bgLoaded}
                trackCount={trackCount}
            />
            <CreditsContainer>
                <CreditsDiv>
                    Music from{' '}
                    <a
                        href="https://stock.adobe.com/audio"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Adobe Stock Audio
                    </a>
                </CreditsDiv>
                <CreditsDiv>
                    Images by{' '}
                    <a
                        href="https://unsplash.com/@wolfgang_hasselmann"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Wolfgang Hasselmann
                    </a>
                </CreditsDiv>
                <CreditsDiv>
                    Icons from{' '}
                    <a
                        href="https://icons8.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Icons8
                    </a>
                </CreditsDiv>
            </CreditsContainer>
        </StyledContainer>
    );
};

export default Player;
