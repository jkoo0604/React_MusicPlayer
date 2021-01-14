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
const barWidth = 15;
const offsetY = 30;

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
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${cWidth}px;
    height: ${cHeight}px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
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

    img:hover {
        transform: scale(1.2);
    }

    img:active {
        opacity: 0.5;
    }
`;

const VizAlbum = styled.div`
    min-height: 200px;
    width: 250px;
    margin: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-bottom: 30px;

    img {
        border-radius: 4px;
        max-height: 200px;
        max-width: 100%;
        box-shadow: 0 10px 60px 20px rgba(255, 255, 255, 0.15),
            2px 2px 8px -2px rgba(0, 0, 0, 1);
    }
`;

const VizAlbumText = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    margin: 15px 0px;
`;

const Visualizer = ({
    idx,
    setIdx,
    autoplay,
    setAutoplay,
    bgLoaded,
    trackCount,
}) => {
    const [audio, setAudio] = useState(null);
    const [songData, setSongData] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [source, setSource] = useState(null);
    const [songContext, setSongContext] = useState(null);
    const [playing, setPlaying] = useState(false);
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
        newAnalyser.smoothingTimeConstant = 0.6;

        const bufferLength = newAnalyser.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);

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

        setAudio(song);
        setSongContext(audioContext);
        setSongData(freqData);
        setAnalyser(newAnalyser);
        setSource(src);
        song.addEventListener('ended', nextTrack);

        return () => {
            cancelAnimationFrame(rafRef.current);
            newAnalyser.disconnect();
            src.disconnect();
            song.removeEventListener('ended', nextTrack);
        };
    }, [idx]);

    useEffect(() => {
        if (autoplay && bgLoaded) {
            togglePlay();
        }
    }, [bgLoaded]);

    const togglePlay = () => {
        if (audio.paused) {
            if (songContext.state === 'suspended') songContext.resume();
            setPlaying(true);
            audio.play();
            rafRef.current = requestAnimationFrame(tick);
        } else {
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
        let barHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText('', centerX, centerY - offsetY);
        ctx.fillText('', centerX, centerY);

        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.font = 'bold 24px Montserrat';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillText(musicInfo[idx]['title'], centerX, centerY - offsetY);

        ctx.font = '16px Montserrat';
        ctx.fillText(musicInfo[idx]['artist'], centerX, centerY);

        for (let i = 0; i < numBars; i++) {
            barHeight = songData[i] * 0.4;

            let rads = (Math.PI * 2) / numBars;
            let y = centerX - Math.cos(rads * i + 0) * radius;
            let x = centerY + Math.sin(rads * i + 0) * radius;
            let y_end = centerX - Math.cos(rads * i + 0) * (radius + barHeight);
            let x_end = centerY + Math.sin(rads * i + 0) * (radius + barHeight);

            drawBar(ctx, x, y, x_end, y_end, barWidth);
        }
    };

    const tick = () => {
        visualize();
        analyser.getByteFrequencyData(songData);
        rafRef.current = requestAnimationFrame(tick);
    };

    const nextTrack = () => {
        setAutoplay(true);
        if (idx === trackCount - 1) {
            setIdx(0);
        } else {
            setIdx(idx + 1);
        }
    };

    const prevTrack = () => {
        setAutoplay(true);
        if (idx === 0) {
            setIdx(trackCount - 1);
        } else {
            setIdx(idx - 1);
        }
    };

    return (
        <VizContainer>
            <VizCanvas>
                <canvas ref={canvasRef} width={cWidth} height={cHeight} />
            </VizCanvas>
            <VizControl>
                <img src={iconPrev} alt="prev" onClick={prevTrack} />
                <img
                    src={playing ? iconPause : iconPlay}
                    alt={playing ? 'pause' : 'play'}
                    onClick={togglePlay}
                />
                <img src={iconNext} alt="next" onClick={nextTrack} />
            </VizControl>
            <VizAlbum>
                <VizAlbumText>
                    {musicInfo[idx]['album']} ({musicInfo[idx]['year']})
                </VizAlbumText>
                <img src={images[`img${idx + 1}`]['file']} alt="albumart" />
            </VizAlbum>
        </VizContainer>
    );
};

export default Visualizer;
