const grabColors = async (imgUrl) => {
    let imgFile,
        w,
        h,
        col,
        r,
        g,
        b,
        a,
        imgData,
        colorsArr,
        colorsArr2 = [],
        colorsRgb = {},
        colors = {};
    r = g = b = a = 0;
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d');

    const imgLoad = new Promise((resolve) => {
        imgFile = new Image();
        imgFile.onload = resolve;
        imgFile.src = imgUrl;
    });

    await imgLoad;
    w = imgFile.width / 3;
    h = imgFile.height / 3;
    c.width = w;
    c.height = h;
    c.drawImage(imgFile, w, h, c.width, c.height, 0, 0, c.width, c.height);
    imgData = c.getImageData(0, 0, c.width, c.height);

    for (let i = 0, data = imgData.data; i < data.length; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        if (a < 255 / 2) continue;
        col = rgbToHex(r, g, b);
        colors['#' + col] = (colors['#' + col] || 0) + 1;
        colorsRgb['#' + col] = [r, g, b];
    }

    colorsArr = Object.entries(colors).sort((a, b) => b[1] - a[1]);

    let i = 0;
    let origin = colorsRgb[colorsArr[0][0]];
    let arrLen = 3;
    let maxDiff = 1;
    let maxDiffCol;
    colorsArr2.push(colorsArr[0][0]);
    while (colorsArr2.length < arrLen && i < colorsArr.length) {
        let curr = colorsArr[i][0];
        let rDiff = (255 - Math.abs(colorsRgb[curr][0] - origin[0])) / 255;
        let gDiff = (255 - Math.abs(colorsRgb[curr][1] - origin[1])) / 255;
        let aDiff = (255 - Math.abs(colorsRgb[curr][2] - origin[2])) / 255;
        if ((rDiff + gDiff + aDiff) / 3 < maxDiff) {
            maxDiff = (rDiff + gDiff + aDiff) / 3;
            maxDiffCol = curr;
        }
        i++;
    }
    colorsArr2.push(maxDiffCol);
    return colorsArr2;
};

const rgbToHex = (r, g, b) => {
    return [r, g, b]
        .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
};

export default grabColors;
