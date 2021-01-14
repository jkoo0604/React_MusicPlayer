const grabColors = async (imgUrl) => {
    // const imgFile = new Image();
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
    // const canvas = document.getElementById('bgimg');
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
    // canvas.width = w * 2;
    // canvas.height = h * 2;
    c.drawImage(imgFile, w, h, c.width, c.height, 0, 0, c.width, c.height);
    imgData = c.getImageData(0, 0, c.width, c.height);
    console.log('width', w, c.width, 'height', h, c.height);
    // console.log(imgData.data[0], imgData.data[1], imgData.data[2]);
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
    console.log(colors);
    colorsArr = Object.entries(colors).sort((a, b) => b[1] - a[1]);
    // colorsArr.splice(5);
    // colorsArr2 = [
    //     colorsArr[0],
    //     colorsArr[500],
    //     colorsArr[1000],
    //     colorsArr[1500],
    //     colorsArr[2000],
    // ];
    // look at center of the image only
    // imgFile.onload = () => {
    //     w = imgFile.width / 3;
    //     h = imgFile.height / 3;
    //     c.width = w;
    //     c.height = h;
    //     c.drawImage(imgFile, w, h, w, h, 0, 0, w, h);
    //     imgData = c.getImageData(0, 0, c.width, c.height);
    //     for (let i = 0; i < imgData.length; i += 10) {
    //         r = imgData[i];
    //         g = imgData[i + 1];
    //         b = imgData[i + 2];
    //         a = imgData[i + 3];
    //         if (a < 255 / 2) continue;
    //         col = rgbToHex(r, g, b);
    //         colors[col] = (colors[col] || 0) + 1;
    //         // grab most commonly occurring colors
    //     }
    //     colorsArr = Object.entries(colors)
    //         .sort((a, b) => b[1] - a[1])
    //         .splice(5);
    // };
    // imgFile.src = imgUrl;
    // console.log('top 5', colorsArr.length);
    // for (let i = 0; i < 5; i++) {
    //     console.log(colorsRgb[colorsArr2[i][0]]);
    // }
    let i = 0;
    let origin = colorsRgb[colorsArr[0][0]];
    let diff = 0.7;
    let arrLen = 3;
    let maxDiff = 1;
    let maxDiffCol;
    console.log('origin', origin);
    colorsArr2.push(colorsArr[0][0]);
    // console.log(colorsArr[0][1]);
    // colorsArr2.push(colorsArr[colorsArr.length - 1][0]);
    // console.log(colorsArr[colorsArr.length - 1][1]);
    while (colorsArr2.length < arrLen && i < colorsArr.length) {
        let curr = colorsArr[i][0];
        // console.log(origin, curr, colorsRgb[curr]);
        // let rDiff =
        //     (255 - Math.abs(colorsRgb[curr][0] - origin[0])) / 255 <= diff;
        // let gDiff =
        //     (255 - Math.abs(colorsRgb[curr][1] - origin[1])) / 255 <= diff;
        // let aDiff =
        //     (255 - Math.abs(colorsRgb[curr][2] - origin[2])) / 255 <= diff;
        // if (rDiff + gDiff + aDiff >= 3) {
        //     colorsArr2.push(curr);
        // }
        let rDiff = (255 - Math.abs(colorsRgb[curr][0] - origin[0])) / 255;
        let gDiff = (255 - Math.abs(colorsRgb[curr][1] - origin[1])) / 255;
        let aDiff = (255 - Math.abs(colorsRgb[curr][2] - origin[2])) / 255;
        if ((rDiff + gDiff + aDiff) / 3 < maxDiff) {
            maxDiff = (rDiff + gDiff + aDiff) / 3;
            maxDiffCol = curr;
        }
        i++;
    }
    // if (colorsArr2.length === 1) {
    //     colorsArr2.push(colorsArr[colorsArr.length - 1][0]);
    // }
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
