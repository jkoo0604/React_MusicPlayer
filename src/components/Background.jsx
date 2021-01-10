// get image from prop (sent by player)
// get color data for center of image only
// create gradient background using the dominent color

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledBg = styled.div`
    width: 100%;
    height: 100%;
`;

const Background = (image) => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        // get dominant colors
        // set colors
    }, [image]);

    return <StyledBg colors={colors} />;
};

export default Background;
