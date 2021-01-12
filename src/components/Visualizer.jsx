// creact visualizer for audio
// get image data from prop (sent by player)
// get current track from prop (sent by player)
// display circular visualizer with title, artist, and album image in the center?
// or title and artist only in the center with album image and control below

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import musicInfo from '../utils/musicInfo';

const VizContainer = styled.div`
    height: 80%;
    width: 80%;
    z-index: 5;
    position: relative;
`;

const VizCanvas = styled.div`
    height: 60%;
`;

const VizControl = styled.div`
    height: 40%;
`;

const Visualizer = ({ idx, setIdx, trackCount }) => {
    const [paused, setPaused] = useState(true);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        let song = new Audio(musicInfo[idx]['file']);
        console.log(song);
        console.log(musicInfo[idx]['file']);
        setAudio(song);
    }, [idx]);

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    return (
        <VizContainer>
            <VizCanvas></VizCanvas>
            <VizControl onClick={togglePlay}>Placeholder Txt</VizControl>
        </VizContainer>
    );
};

export default Visualizer;
