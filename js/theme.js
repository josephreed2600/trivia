// TODO add colorful themes and select one at random on page load
const themes = {
    "light": {
        "bg": "#eeeeeeff",
        "fg": "#202020ff",
        "tile": "#ddddddff",
        "tile-hover": "#ccccccff",
        "dialog": "#ccccccff",
        "option": "#bbbbbbff",
        "option-hover": "#aaaaaaff",
        "ok": "#88dd77ff",
        "ok-text": "#202020ff",
        "bad": "#dd8877ff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",

        "offset": "#bbbbbbff",
        "highlight": "#aaaaaaff",
        "standout": "#777777ff",
        "off-bg": "#ddddddff",
        "off-fg": "#303030ff",
        "empty": "#ccccccff",
    },

    "dark": {
        "bg": "#202020ff",
        "fg": "#eeeeeeff",
        "tile": "#303030ff",
        "tile-hover": "#404040ff",
        "dialog": "#404040ff",
        "option": "#505050ff",
        "option-hover": "#606060ff",
        "ok": "#88dd77ff",
        "ok-text": "#202020ff",
        "bad": "#dd8877ff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",

        "offset": "#444444ff",
        "highlight": "#555555ff",
        "standout": "#999999ff",
        "off-bg": "#303030ff",
        "off-fg": "#ddddddff",
        "empty": "#ccccccff",
    },

    "unimplemented": {
        "bg": "#202020ff",
        "fg": "#eeeeeeff",
        "tile": "#303030ff",
        "tile-hover": "#404040ff",
        "dialog": "#404040ff",
        "option": "#505050ff",
        "option-hover": "#606060ff",
        "ok": "#88dd77ff",
        "ok-text": "#202020ff",
        "bad": "#dd8877ff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",

        "offset": "#444444ff",
        "highlight": "#555555ff",
        "standout": "#999999ff",
        "off-bg": "#303030ff",
        "off-fg": "#ddddddff",
        "empty": "#ccccccff",
    }
};

const populateThemes = () => {
    document.getElementsByTagName('head')[0].innerHTML += '<style id="theme-rules"></style>';
    let rules = document.getElementById('theme-rules');
    for (let theme in themes) if(themes.hasOwnProperty(theme)) {
        console.log('Adding theme: ' + theme);
        let t = themes[theme];
        let b = `body.theme-${theme}`;
        let themeStyles = `
            ${b} {
                background-color: ${t['bg']};
                color: ${t['fg']};
            }
            ${b} h1 {
                color: ${t['fg']};
            }
            ${b} .midground {
                background-color: ${t['off-bg']};
            }
            ${b} .highground {
                background-color: ${t['offset']};
            }
            ${b} .fake-checkbox {
                background-color: ${t['empty']};
            }
            ${b} input:checked + label .fake-checkbox, .fake-checkbox.checked {
                background-color: ${t['ok']};
            }
            ${b} .butan {
                background-color: ${t['off-bg']};
            }
            ${b} .bingo-tile {
                background-color: ${t['tile']};
            }
            ${b} .bingo-tile:hover {
                background-color: ${t['tile-hover']};
            }
            ${b} #dialog-ctr > div {
                background-color: ${t['dialog']};
            }
            ${b} .option {
                background-color: ${t['option']};
            }
            ${b} .option:hover {
                background-color: ${t['option-hover']};
            }
            ${b} #dialog-ctr > div.correct, ${b} .bingo-tile.correct, ${b} .option.correct {
                background-color: ${t['ok']};
                color: ${t['ok-text']};
            }
            ${b} #dialog-ctr > div.correct > .option:not(.correct):not(.incorrect), ${b} #dialog-ctr > div.incorrect > .option:not(.correct):not(.incorrect) {
                background-color: ${t['washed']};
                color: ${t['washed-text']};
            }
            ${b} #dialog-ctr > div.incorrect, ${b} .bingo-tile.incorrect, ${b} .option.incorrect {
                background-color: ${t['bad']};
                color: ${t['bad-text']};
            }
            ${b} #commence, ${b} #recommence {
                background-color: ${t['option']};
            }
            ${b} #commence:hover, ${b} #recommence:hover {
                background-color: ${t['option-hover']};
            }
        `;
        rules.innerHTML += themeStyles;
    }
};

const applyTheme = (theme) => {
    console.log('Theme: ' + theme);
    let body = document.getElementsByTagName('body')[0];
    for (let t in themes) {
        body.classList.remove(`theme-${t}`);
    }
    if (!themes[theme]) theme = 'unimplemented';
    body.classList.add(`theme-${theme}`);
    document.getElementById('mobile-address-bar-color').content = themes[theme]['bg'];
    setPersistentTheme(theme);
};

const setPersistentTheme = (theme) => {
    setCookie('theme', theme);
};

const doThemes = () => {
    populateThemes();
    applyTheme(getCookie()['theme']||'unimplemented');
};

document.addEventListener('DOMContentLoaded', doThemes);