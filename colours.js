/* eslint-disable require-unicode-regexp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable handle-callback-err */
'use strict';

const urlParams = new URLSearchParams(window.location.search),
  extend = urlParams.get('extend');

let sorted = {
    'Neutrals': {
      'Neutrals': [],
      'Lights': [],
      'Grays': [],
      'Darks': []
    },
    'Shades': {
      'Shades': [],
      'Pastels': [],
      'Neutrals': [],
      'Darks': []
    },
    'Reds': {
      'Reds': [],
      'Pinks': []
    },
    'Yellows': {
      'Yellows': []
    },
    'Oranges': {
      'Oranges': []
    },
    'Browns': {
      'Browns': []
    },
    'Greens': {
      'Greens': []
    },
    'Blues': {
      'Blues': [],
      'Light': [],
      'Dark': [],
      'Purples': []
    },
    'Other': {
      'Other': []
    }
  },
  smallSorted = {},
  colorsHTML = '';

const fn = {
  brightnessByColor: color => {
    var m = color.substr(1).match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g);
    if (m) var r = parseInt(m[0], 16),
      g = parseInt(m[1], 16),
      b = parseInt(m[2], 16);
    if (typeof r != "undefined") {
      return ((r * 299) + (g * 587) + (b * 114)) / 1000;
    }
  },
  categorize: colour => {
    const col = ntc.name(colour);
    let output = `<div class="color-sample ${fn.brightnessByColor(colour) > 100 ? 'light' : 'dark'}" style="background-color:${colour}">
      <i>${colour}</i>
      <span class="category ${col[2] ? 'accurate' : 'approximate'}" > ${col[1]}</span>
    </div>`;

    return output;
  },
  canvas: {
    drawImageScaled: (img, ctx) => {
      let canvas = ctx.canvas;
      let hRatio = canvas.width / img.width;
      let vRatio = canvas.height / img.height;
      let ratio = Math.min(hRatio, vRatio);
      let orientation = img.width > img.height ? 'landscape' : 'portrait';
      // console.log(ratio);
      if (ratio > 1 && ratio < 1.1) {
        ratio = 0.9;
      }
      // console.log(ratio);
      let centerShift_x = 0;
      if (orientation === 'landscape') {
        centerShift_x = (canvas.width - img.width * ratio) / 2;
      }
      ctx.drawImage(img, centerShift_x, 0, img.width * ratio, img.height * ratio);
      return {
        ratio,
        orientation
      };
    },
    addRectangle: ({
      key = 0,
      length = 0,
      offset = 0,
      color,
      name = ntc.name(color),
      imgData
    }) => {
      let canvas = ctx.canvas;
      let width;
      let height;
      let x_coord;
      let y_coord;
      if (imgData.orientation === 'landscape') {
        width = canvas.width / length;
        height = canvas.height - (offset * imgData.ratio);
        x_coord = key * width;
        y_coord = offset * imgData.ratio;
      } else {
        width = canvas.width - (offset * imgData.ratio);
        height = canvas.height / length;
        y_coord = key * height;
        x_coord = offset * imgData.ratio;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x_coord, y_coord, width, height);
      console.log(x_coord, y_coord, width, height);
    },
    toImg: (canvas) => {
      var image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    }
  }
};

let canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let q = new URLSearchParams(window.location.search);
q = decodeURI(q.get('q'));

// search
if (q && q.length && q !== 'null') {
  document.querySelector('input[type=search]').value = q;
  q.replace(' ', '');

  // input format
  if (q.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
    // url
    let img = new Image();
    img.src = q;
    img.onload = () => {
      const imgData = fn.canvas.drawImageScaled(img, ctx);
      Vibrant.from(`https://cors-escape.herokuapp.com/${q}`).getPalette((err, palette) => {
        if (palette) {
          let paletteKeys = Object.keys(palette);
          const paletteLength = paletteKeys.length;
          let i = 0;
          for (const key in palette) {
            fn.canvas.addRectangle({
              key: i,
              length: paletteLength,
              color: palette[key].hex,
              offset: imgData.orientation === 'landscape' ? img.height : img.width,
              imgData,
            });
            i++;
          }
        }
      });
    }
  } else if (q.match(/[0-9]*\,[0-9]*\,[0-9]*/g)) {}
}