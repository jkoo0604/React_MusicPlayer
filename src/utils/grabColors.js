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
        colorsArr2,
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
    c.drawImage(imgFile, w, h, w, h, 0, 0, w, h);
    imgData = c.getImageData(0, 0, c.width, c.height);
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
        // grab most commonly occurring colors
    }
    console.log(colors);
    colorsArr = Object.entries(colors).sort((a, b) => b[1] - a[1]);
    // colorsArr.splice(5);
    colorsArr2 = [
        colorsArr[0],
        colorsArr[500],
        colorsArr[1000],
        colorsArr[1500],
        colorsArr[2000],
    ];
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
    for (let i = 0; i < 5; i++) {
        console.log(colorsRgb[colorsArr2[i][0]]);
    }
    return colorsArr2.map((c) => c[0]);
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
