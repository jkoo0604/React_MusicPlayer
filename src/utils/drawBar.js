const drawBar = (canvasContext, x1, y1, x2, y2, width) => {
    const gradient = canvasContext.createLinearGradient(x1, y1, x2, y2);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = gradient;
    canvasContext.beginPath();
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
    canvasContext.closePath();
};

export default drawBar;
