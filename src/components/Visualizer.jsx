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
import iconNext from '../assets/icon-next.png';
import iconPrev from '../assets/icon-prev.png';
import iconPlay from '../assets/icon-play.png';
import iconPause from '../assets/icon-pause.png';

const numBars = 100;
const cWidth = 500;
const cHeight = 500;
const radius = 150;
const barWidth = 5;
// let freqArr;

const VizContainer = styled.div`
    height: 100%;
    width: 100%;
    z-index: 5;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 30px;
`;

const VizCanvas = styled.div`
    // height: 60%;
    // position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${cWidth}px;
    height: ${cHeight}px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.1);
`;

const VizControl = styled.div`
    position: absolute;
    top: 335px;
    left: calc((100vw / 2) - 100px);
    width: 200px;
    display: flex;
    justify-content: space-between;

    img {
        height: 24px;
    }
`;

const VizAlbum = styled.div`
    height: 200px;
    width: 250px;
    margin: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    
    img {
        border-radius: 4px;
        max-height: 100%;
        max-width: 100%;
        box-shadow: 0 10px 80px 20px rgba(255, 255, 255, 0.15), 2px 2px 8px -2px rgba(0, 0, 0, 1);
        // box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    }
`;

const VizAlbumText = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    margin: 15px 0px;
`;

const Visualizer = ({ idx, setIdx, autoplay, setAutoplay, bgLoaded, trackCount }) => {
    // const [paused, setPaused] = useState(true);
    const [audio, setAudio] = useState(null);
    const [songData, setSongData] = useState(null);
    // const [dataArray, setDataArray] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [source, setSource] = useState(null);
    const [songContext, setSongContext] = useState(null);
    const [playing, setPlaying] = useState(false);
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
        newAnalyser.fftSize = 256;
        newAnalyser.smoothingTimeConstant = 1;

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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
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
        song.addEventListener('ended', nextTrack);

        return () => {
            console.log('cleaning up');
            cancelAnimationFrame(rafRef.current);
            newAnalyser.disconnect();
            src.disconnect();
            song.removeEventListener('ended', nextTrack);
        };
        // return cleanUp;
    }, [idx]);

    useEffect(() => {
        if (autoplay && bgLoaded) {
            console.log('inside useeffect, togglplay');
            togglePlay();
        } else {
            console.log('autoplay false');
        }

    }, [bgLoaded]);

    const togglePlay = () => {
        if (audio.paused) {
            if (songContext.state === 'suspended') songContext.resume();
            console.log('playing');
            setPlaying(true);
            audio.play();
            rafRef.current = requestAnimationFrame(tick);
        } else {
            console.log('pausing');
            setPlaying(false);
            audio.pause();
            cancelAnimationFrame(rafRef.current);
        }
    };

    const visualize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = cWidth / 2;
        const centerY = cHeight / 2;
        let offsetY = 30;
        let barHeight;

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText('', centerX, centerY - offsetY);
        ctx.fillText('', centerX, centerY);

        // display song info
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.font = 'bold 24px Montserrat';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillText(musicInfo[idx]['title'], centerX, centerY - offsetY);

        ctx.font = '16px Montserrat';
        ctx.fillText(musicInfo[idx]['artist'], centerX, centerY);
        
        // console.log(songData);
        // console.log(freqArr);

        // redraw bars
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
        // cleanUp();
        setAutoplay(true);
        if (idx === trackCount - 1) {
            setIdx(0);
        } else {
            setIdx(idx + 1);
        }
    }

    const prevTrack = () => {
        setAutoplay(true);
        if (idx === 0) {
            setIdx(trackCount - 1);
        } else {
            setIdx(idx - 1);
        }
    }

    const removePlayer = () => {
        // cleanUp();
        setIdx(-1);
    }

    return (
        <VizContainer>
            <VizCanvas>
                <canvas ref={canvasRef} width={cWidth} height={cHeight} />
            </VizCanvas>
            <VizControl>
                <img src={iconPrev} alt='prev' onClick={prevTrack} />
                <img src={playing ? iconPause : iconPlay} alt={playing ? 'pause' : 'play'} onClick={togglePlay} />
                <img src={iconNext} alt='next' onClick={nextTrack} />
            </VizControl> 
            <VizAlbum>
                <VizAlbumText>
                    {musicInfo[idx]['album']} ({musicInfo[idx]['year']})
                </VizAlbumText>
                {/* <div onClick={togglePlay}>Placeholder Txt</div>
                <div onClick={nextTrack}>Next</div>
                <div onClick={removePlayer}>Stop</div> */}
                <img src={images[`img${idx + 1}`]['file']} alt="albumart" />
            </VizAlbum>
        </VizContainer>
    );
};

export default Visualizer;
