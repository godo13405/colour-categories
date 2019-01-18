/* eslint-disable complexity */

'use strict';

// eslint-disable-next-line max-lines-per-function
const colourFilter = (x, sorted) => {
    let hue = x[0],
        saturation = x[1],
        luminosity = x[2],
        output = [];

    // greys
    if (saturation <= 7 && luminosity > 70) {
        if (sorted) {
            sorted.Neutrals.Lights.push(x)
        }
        output.push('Light');
    }
    if (saturation <= 6 && luminosity > 10 && luminosity < 70) {
        if (sorted) {
            sorted.Neutrals.Grays.push(x)
        }
        output.push('Gray');
    }
    if ((saturation <= 20 && luminosity <= 27) || (saturation <= 50 && luminosity <= 25)) {
        if (sorted) {
            sorted.Neutrals.Darks.push(x)
        }
        output.push('Dark');
    }
    // neutrals
    if (saturation > 0 && saturation <= 71 && luminosity >= 62) {
        if (sorted) {
            sorted.Shades.Pastels.push(x)
        }
        output.push('Pastel');
    } else if (saturation >= 7 && saturation <= 27 && luminosity <= 70 && luminosity >= 28) {
        if (sorted) {
            sorted.Shades.Neutrals.push(x)
        }
        output.push('Neutral');
    }
    if ((saturation >= 10 && luminosity <= 15) || (saturation > 5 && saturation < 9 && luminosity <= 29) && saturation < 50) {
        if (sorted) {
            sorted.Shades.Darks.push(x)
        }
        output.push('Dark');
    }
    // reds
    if (saturation >= 28 && (hue <= 18 || hue > 335) && luminosity > 20) {
        if (luminosity >= 60) {
            if (sorted) {
                sorted.Reds.Pinks.push(x)
            }
            output.push('Pink');
        }
        if (luminosity < 60) {
            if (sorted) {
                sorted.Reds.Reds.push(x)
            }
            output.push('Red');
        }
    }
    if (hue >= 57 && hue < 165) {
        if (sorted) {
            sorted.Greens.Greens.push(x)
        }
        output.push('Green');
    }
    // blues
    if (hue > 165 && hue < 265 && luminosity > 15) {
        if (luminosity >= 35) {
            if (sorted) {
                sorted.Blues.Light.push(x)
            }
            output.push('Light');
        }
        if (luminosity < 35) {
            if (sorted) {
                sorted.Blues.Dark.push(x)
            }
            output.push('Dark');
        }
    }
    if (hue > 255 && hue < 335) {
        if (sorted) {
            sorted.Blues.Purples.push(x)
        }
        output.push('Purple');
    }
    if (hue <= 38 && saturation > 20 && ((saturation < 75 && luminosity <= 60) || (saturation <= 80 && luminosity <= 22)) && luminosity > 15) {
        if (sorted) {
            sorted.Browns.Browns.push(x)
        }
        output.push('Brown');
    }
    if (hue > 20 && hue < 35 && saturation >= 55 && luminosity > 25 && luminosity < 80) {
        if (sorted) {
            sorted.Oranges.Oranges.push(x)
        }
        output.push('Orange');
    }
    if (hue >= 35 && hue <= 60 && luminosity > 27 && luminosity < 80 && saturation >= 35) {
        if (sorted) {
            sorted.Yellows.Yellows.push(x)
        }
        output.push('Yellow');
    }
    if (saturation < 15 && luminosity > 35 && luminosity < 60) {
        if (sorted) {
            sorted.Shades.Neutrals.push(x)
        }
        output.push('Neutral');
    }
    if (!output.length) {
        if (sorted) {
            sorted.Other.Other.push(x)
        } else {
            console.log(hue, saturation, luminosity);
        }
        output.push('Other');
    }

    return output;
};

export default colourFilter;