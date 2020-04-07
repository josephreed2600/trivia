// TODO add colorful themes and select one at random on page load
const themes = {
/*
// ew no
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
    },
    */
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
        "bad": "#df725cff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",
    },

    "blue": {
        "bg": "#384fa5ff",
        "fg": "#eeeef4ff",
        "tile": "#3139a3ff",
        "tile-hover": "#313495ff",
        "dialog": "#313495ff",
        "option": "#3b3db3ff",
        "option-hover": "#4555d4ff",
        "ok": "#68c056ff",
        "ok-text": "#202020ff",
        "bad": "#e76e56ff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",
    },

    "orange": {
        "bg": "#a5500cff",
        "fg": "#402020ff",
        "tile": "#ee9955ff",
        "tile-hover": "#eeaa55ff",
        "dialog": "#eeaa55ff",
        "option": "#e59a3aff",
        "option-hover": "#e78200ff",
        "ok": "#69c855ff",
        "ok-text": "#202020ff",
        "bad": "#f74825ff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",
    },

    "violet": {
        "bg": "#50345dff",
        "fg": "#eeeef4ff",
        "tile": "#3e1049ff",
        "tile-hover": "#451e5dff",
        "dialog": "#451e5dff",
        "option": "#702b78ff",
        "option-hover": "#9f2eabff",
        "ok": "#53b140ff",
        "ok-text": "#202020ff",
        "bad": "#b63f3fff",
        "bad-text": "#202020ff",
        "washed": "#eeeeee22",
        "washed-text": "#20202066",
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
    //setPersistentTheme(theme);
};

const setPersistentTheme = (theme) => {
    setCookie('theme', theme);
};

const doThemes = () => {
    populateThemes();
    let test = null; // hard-code to specify a theme for debugging
    applyTheme(getCookie()['theme']||test||Object.keys(themes).random());
    console.log(`Usage example: applyTheme('${Object.keys(themes).random()}')`);
};

document.addEventListener('DOMContentLoaded', doThemes);