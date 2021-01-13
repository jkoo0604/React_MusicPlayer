// creact visualizer for audio
// get image data from prop (sent by player)
// get current track from prop (sent by player)
// display circular visualizer with title, artist, and album image in the center?
// or title and artist only in the center with album image and control below

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import musicInfo from '../utils/musicInfo';
import images from '../utils/images';
import drawBar from '../utils/drawBar';

const numBars = 150;
const cWidth = 500;
const cHeight = 300;
const radius = 50;
const barWidth = 2;
// let freqArr;

const VizContainer = styled.div`
    height: 80%;
    width: 80%;
    z-index: 5;
    position: relative;
`;

const VizCanvas = styled.div`
    // height: 60%;
    // position: relative;
`;

const VizControl = styled.div`
    // height: 40%;
    // position: relative;

    img {
        height: 200px;
    }
`;

const Visualizer = ({ idx, setIdx, trackCount }) => {
    // const [paused, setPaused] = useState(true);
    const [audio, setAudio] = useState(null);
    const [songData, setSongData] = useState(null);
    // const [dataArray, setDataArray] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [source, setSource] = useState(null);
    const [songContext, setSongContext] = useState(null);
    // const [title, setTitle] = useState('');
    // const [artist, setArtist] = useState('');
    const canvasRef = useRef();
    const rafRef = useRef();

    useEffect(() => {
        let song = new Audio(musicInfo[idx]['file']);
        const audioContext = new AudioContext();
        const src = audioContext.createMediaElementSource(song);
        const newAnalyser = audioContext.createAnalyser();

        src.connect(newAnalyser);
        newAnalyser.connect(audioContext.destination);
        newAnalyser.fftSize = 512;

        const bufferLength = newAnalyser.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        // freqArr = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const centerX = cWidth / 2;
        const centerY = cHeight / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        // console.log(freqArr);

        setAudio(song);
        setSongContext(audioContext);
        setSongData(freqData);
        setAnalyser(newAnalyser);
        setSource(src);
        // setTitle(musicInfo[idx]['title']);
        // setArtist(musicInfo[idx]['artist']);
        // return () => {
        //     // console.log(analyser);
        //     cancelAnimationFrame(rafRef.current);
        //     analyser.disconnect();
        //     source.disconnect();
        // };
        // return cleanUp;
    }, [idx]);

    const togglePlay = () => {
        if (audio.paused) {
            if (songContext.state === 'suspended') songContext.resume();
            console.log('playing');
            audio.play();
            rafRef.current = requestAnimationFrame(tick);
        } else {
            console.log('pausing');
            audio.pause();
            cancelAnimationFrame(rafRef.current);
        }
    };

    const visualize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = cWidth / 2;
        const centerY = cHeight / 2;
        let barHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // console.log(songData);
        // console.log(freqArr);

        for (let i = 0; i < numBars; i++) {
            barHeight = songData[i] * 0.5;
            // barHeight = freqArr[i] * 0.5;

            let rads = (Math.PI * 2) / numBars;
            let x = centerX + Math.cos(rads * i) * radius;
            let y = centerY + Math.sin(rads * i) * radius;
            let x_end = centerX + Math.cos(rads * i) * (radius + barHeight);
            let y_end = centerY + Math.sin(rads * i) * (radius + barHeight);

            drawBar(ctx, x, y, x_end, y_end, barWidth);
        }
    };

    const tick = () => {
        visualize();
        // let newArray = new Uint8Array(analyser.frequencyBinCount);
        // analyser.getByteTimeDomainData(newArray);
        // analyser.getByteTimeDomainData(freqArr);
        analyser.getByteTimeDomainData(songData);
        // console.log(newArray.current.buffer);
        // setSongData(newArray.buffer);
        rafRef.current = requestAnimationFrame(tick);
    };

    const cleanUp = () => {
        cancelAnimationFrame(rafRef.current);
        // analyser.disconnect();
        // source.disconnect();
    }

    const nextTrack = () => {
        cleanUp();
        setIdx(idx + 1);
    }

    return (
        <VizContainer>
            <VizCanvas>
                <canvas ref={canvasRef} width={cWidth} height={cHeight} />
            </VizCanvas>
            <VizControl>
                <div onClick={togglePlay}>Placeholder Txt</div>
                <img src={images[`img${idx + 1}`]['file']} alt="albumart" />
                <div onClick={nextTrack}>Next</div>
            </VizControl>
        </VizContainer>
    );
};

export default Visualizer;
