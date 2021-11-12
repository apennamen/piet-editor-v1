
const HUE = {
    H_RED: 0,
    H_YELLOW: 1,
    H_GREEN: 2,
    H_CYAN: 3,
    H_BLUE: 4,
    H_MAGENTA: 5,
    H_WHITE: 0,
    H_BLACK: 0,
};

const LIGHTNESS = {
    LIGHT: 0,
    NORMAL: 1,
    DARK: 2,
};

const LIGHT_RED = {name: 'lightred', value: '#FFC0C0', hue: HUE['H_RED'], lightness: LIGHTNESS['LIGHT']};
const LIGHT_YELLOW = {name: 'lightyellow', value: '#FFFFC0', hue: HUE['H_YELLOW'], lightness: LIGHTNESS['LIGHT']};
const LIGHT_GREEN = {name: 'lightgreen', value: '#C0FFC0', hue: HUE['H_GREEN'], lightness: LIGHTNESS['LIGHT']};
const LIGHT_CYAN = {name: 'lightcyan', value: '#C0FFFF', hue: HUE['H_CYAN'], lightness: LIGHTNESS['LIGHT']};
const LIGHT_BLUE = {name: 'lightblue', value: '#C0C0FF', hue: HUE['H_BLUE'], lightness: LIGHTNESS['LIGHT']};
const LIGHT_MAGENTA = {name: 'lightmagenta', value: '#FFC0FF', hue: HUE['H_MAGENTA'], lightness: LIGHTNESS['LIGHT']};
const RED = {name: 'red', value: '#FF0000', hue: HUE['H_RED'], lightness: LIGHTNESS['NORMAL']};
const YELLOW = {name: 'yellow', value: '#FFFF00', hue: HUE['H_YELLOW'], lightness: LIGHTNESS['NORMAL']};
const GREEN = {name: 'green', value: '#00FF00', hue: HUE['H_GREEN'], lightness: LIGHTNESS['NORMAL']};
const CYAN = {name: 'cyan', value: '#00FFFF', hue: HUE['H_CYAN'], lightness: LIGHTNESS['NORMAL']};
const BLUE = {name: 'blue', value: '#0000FF', hue: HUE['H_BLUE'], lightness: LIGHTNESS['NORMAL']};
const MAGENTA = {name: 'magenta', value: '#FF00FF', hue: HUE['H_MAGENTA'], lightness: LIGHTNESS['NORMAL']};
const DARK_RED = {name: 'darkred', value: '#C00000', hue: HUE['H_RED'], lightness: LIGHTNESS['DARK']};
const DARK_YELLOW = {name: 'darkyellow', value: '#C0C000', hue: HUE['H_YELLOW'], lightness: LIGHTNESS['DARK']};
const DARK_GREEN = {name: 'darkgreen', value: '#00C000', hue: HUE['H_GREEN'], lightness: LIGHTNESS['DARK']};
const DARK_CYAN = {name: 'darkcyan', value: '#00C0C0', hue: HUE['H_CYAN'], lightness: LIGHTNESS['DARK']};
const DARK_BLUE = {name: 'darkblue', value: '#0000C0', hue: HUE['H_BLUE'], lightness: LIGHTNESS['DARK']};
const DARK_MAGENTA = {name: 'darkmagenta', value: '#C000C0', hue: HUE['H_MAGENTA'], lightness: LIGHTNESS['DARK']};

const WHITE = {name: 'white', value: '#FFFFFF', hue: HUE['H_WHITE'], lightness: LIGHTNESS['LIGHT']};
const BLACK = {name: 'black', value: '#000000', hue: HUE['H_BLACK'], lightness: LIGHTNESS['LIGHT']};

const WHITE_INSTR = { label: 'noop', color: WHITE };
const BLACK_INSTR = { label: 'block', color: BLACK };

/**
 * Order colors by lightness cycle and hue cycle.
 * 
 * Lightness cycle: light -> normal -> dark -> light
 * Hue cycle: red -> yellow -> green -> cyan -> blue -> magenta -> red
 */
const MAPPING = [
    [
        LIGHT_RED,
        LIGHT_YELLOW,
        LIGHT_GREEN,
        LIGHT_CYAN, 
        LIGHT_BLUE, 
        LIGHT_MAGENTA,
    ],
    [
        RED,
        YELLOW,
        GREEN,
        CYAN, 
        BLUE,
        MAGENTA,
    ],
    [
        DARK_RED,
        DARK_YELLOW,
        DARK_GREEN,
        DARK_CYAN, 
        DARK_BLUE, 
        DARK_MAGENTA,
    ]
];

/**
 * First index is lightness change, second is hue change
 */
const INSTRUCTIONS = [
    ['none', 'add', 'divide', 'greater', 'duplicate', 'in(char)'],
    ['push', 'substract', 'mod', 'pointer', 'roll', 'out(number)'],
    ['pop', 'multiply', 'not', 'switch', 'in(number)', 'out(char)'],
];

const instructionsList = (currentInstruction) => {
    const { hue, lightness } = currentInstruction.color;
    const result = [];

    INSTRUCTIONS.forEach((subInstructions, lightnessIndex) => {
        subInstructions.forEach((label, hueIndex) => {
            const normalizedLightnessIndex = (lightnessIndex + lightness) % 3;
            const normalizedHueIndex = (hueIndex + hue) % 6;
            result.push({
                label,
                color: MAPPING[normalizedLightnessIndex][normalizedHueIndex],
            })
        });
    });

    result.push(WHITE_INSTR);
    result.push(BLACK_INSTR);

    return result;
}

export {
    WHITE_INSTR,
    instructionsList,
};
