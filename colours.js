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
  nameColour: colour => {
    fetch().then(x => x.json()).then(x => {

    });
  }
};

let q = new URLSearchParams(window.location.search);
q = decodeURI(q.get('q'));

if (!extend || (q && q.length)) {
  smallSorted = {
    'Gray': sorted.Neutrals.Lights.concat(sorted.Neutrals.Grays),
    'Pastel': sorted.Shades.Pastels,
    'Neutral': sorted.Shades.Neutrals,
    'Dark': sorted.Neutrals.Darks.concat(sorted.Shades.Darks),
    'Red': sorted.Reds.Reds.concat(sorted.Reds.Pinks),
    'Yellow': sorted.Yellows.Yellows.concat(sorted.Oranges.Oranges),
    'Green': sorted.Greens.Greens,
    'Blue': sorted.Blues.Blues.concat(sorted.Blues.Blues, sorted.Blues.Light, sorted.Blues.Dark, sorted.Blues.Purples),
    'Brown': sorted.Browns.Browns,
    'Other': sorted.Other.Other
  };
}
if (!extend) {
  sorted = smallSorted;
}

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
      document.querySelector('.output-container').innerHTML = `<img class="image" width="${img.width}" height="${img.height}" src='${q}' />${document.querySelector('.output-container').innerHTML}`;

      let list = '',
          tempCategories;
      Vibrant.from(`https://cors-escape.herokuapp.com/${q}`).getPalette((err, palette) => {
        const colourCategories = Object.keys(smallSorted);
        for (const key in palette) {
          tempCategories = fn.categorize(palette[key].hex);
          list += tempCategories;
        }
        document.querySelector('.categories').innerHTML = list;
      });
    }
  } else if (q.match(/[0-9]*\,[0-9]*\,[0-9]*/g)) {
    // colour
    q = q.split(',');
    document.querySelector('.categories').innerHTML = fn.categorize(q);
  }
}