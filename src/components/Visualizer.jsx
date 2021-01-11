// creact visualizer for audio
// get image data from prop (sent by player)
// get current track from prop (sent by player)
// display circular visualizer with title, artist, and album image in the center?
// or title and artist only in the center with album image and control below

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const VizContainer = styled.div`
    height: 80%;
    width: 80%;
`;

const VizCanvas = styled.div`
    height: 60%;
`;

const VizControl = styled.div`
    height: 40%;
`;

const Visualizer = ({idx, setIdx, trackCount}) => {
    return (
        <VizContainer>
            <VizCanvas></VizCanvas>
            <VizControl></VizControl>
        </VizContainer>
    );
};

export default Visualizer;
