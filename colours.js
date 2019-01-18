/* eslint-disable require-unicode-regexp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable handle-callback-err */
'use strict';

import colours from './colours-list.js';
import colourFilter from './colourFilter.js';

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
  colorsHTML = '';

const fn = {
  colorsToInsert: col => {
    colorsHTML = `${colorsHTML}<div class="color" style="background-color:hsl(${col[0]},${col[1]}%,${col[2]}%)"></div>`;
  },
  rgbToHsl: (rgb) => {
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }

      h /= 6;
    }

    h = Math.round(h * 360); // °
    s = Math.round(s * 100); // %
    l = Math.round(l * 100); // %

    return [h, s, l];
  },
  arraySort: (a, b) => {
    if ((a[2] / 2) + (a[1] / a[0]) > (b[2] / 2) + (b[1] / b[0])) {
      return 1;
    } else {
      return -1;
    }
  },
  categorize: (colour) => {
    let cats = colourFilter(colour),
      output = `<div class="color"><span class="color-sample" style="background:hsl(${colour[0]},${colour[1]}%,${colour[2]}%)"><i>${colour[0]}, ${colour[1]}, ${colour[2]}</i></span>`;
    for (const cat of cats) {
      output += `<span class="category">${cat}</span>`;
    }
    output += '</div>';

    return output;
  }
};

for (let x of colours) {
  x = fn.rgbToHsl(x);
  colourFilter(x, sorted);
}

if (!extend) {
  sorted = {
    'Grays': sorted.Neutrals.Lights.concat(sorted.Neutrals.Grays),
    'Pastels': sorted.Shades.Pastels,
    'Neutrals': sorted.Shades.Neutrals,
    'Darks': sorted.Neutrals.Darks.concat(sorted.Shades.Darks),
    'Reds': sorted.Reds.Reds.concat(sorted.Reds.Pinks),
    'Yellows': sorted.Yellows.Yellows.concat(sorted.Oranges.Oranges),
    'Greens': sorted.Greens.Greens,
    'Blues': sorted.Blues.Blues.concat(sorted.Blues.Blues, sorted.Blues.Light, sorted.Blues.Dark, sorted.Blues.Purples),
    'Browns': sorted.Browns.Browns,
    'Others': sorted.Other.Other
  };
}

for (let x in sorted) {
  if (Array.isArray(sorted[x])) {
    sorted[x].sort(fn.arraySort);
  } else {
    for (let xx in sorted[x]) {
      sorted[x][xx].sort(fn.arraySort);
    }
  }
}

for (let s in sorted) {
  if (Array.isArray(sorted[s])) {
    colorsHTML = `${colorsHTML}<div class="category"><h3>${s} <sup>${sorted[s].length}</sup></h3>`;
    for (let x of sorted[s]) {
      fn.colorsToInsert(x);
    }
    colorsHTML = `${colorsHTML}</div>`;
  } else {
    for (let ss in sorted[s]) {
      if (ss !== s) {
        colorsHTML = `${colorsHTML}<div class="sub-category"><h5>${ss} <sup>${sorted[s][ss].length}</sup></h5>`;
      } else {
        colorsHTML = `${colorsHTML}<div class="category"><h3>${ss} <sup>${sorted[s][ss].length}</sup></h3>`;
      }

      for (let x of sorted[s][ss]) {
        fn.colorsToInsert(x);
      }
      colorsHTML = `${colorsHTML}</div>`;
    }
  }
}

document.querySelector('body').innerHTML = `${document.querySelector('body').innerHTML}${colorsHTML}`;

// search
let q = new URLSearchParams(window.location.search);
q = decodeURI(q.get('q'));

if (q && q.length) {
  document.querySelector('input[type=search]').value = q;
  q.replace(' ', '');

  // input format
  if (q.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
    // url
    document.querySelector('.output-container').innerHTML = `<span class="image" style='background-image:url(${q})'></span>${document.querySelector('.output-container').innerHTML}`;

    let list = '';
    Vibrant.from(q).getPalette((err, palette) => {
      console.log('palette ', palette);
      for (const key in palette) {
        list += fn.categorize(fn.rgbToHsl(palette[key].rgb));
      }
      document.querySelector('.categories').innerHTML = list;
    });
  } else if (q.match(/[0-9]*\,[0-9]*\,[0-9]*/g)) {
    // colour
    q = q.split(',');
    document.querySelector('.categories').innerHTML = fn.categorize(q);
  }
}