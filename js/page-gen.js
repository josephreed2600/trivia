const head_content = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta id="mobile-address-bar-color" name="theme-color" content="" />
    <link href="css/site.css" rel="stylesheet" type="text/css" />
`;

const grid_style = `
    <style id="grid-style">
        #bingo-ctr {
            grid-template-columns: repeat(${Bingo.COLS}, 1fr);
            grid-template-rows: repeat(${Bingo.ROWS}, 1fr);
        }
    </style>
`;

document.addEventListener('DOMContentLoaded', (evt) => {
    document.getElementsByTagName('head')[0].innerHTML += head_content;
    document.getElementsByTagName('head')[0].innerHTML += grid_style;

    Bingo.dialog_ctr = document.getElementById('dialog-ctr');
    Bingo.dialog_ctr.innerHTML = `<div id="dialog"></div>`;
    Bingo.dialog = document.getElementById('dialog');

    if(!localStorage[Bingo.localStorageName]) {
        localStorage[Bingo.localStorageName] = JSON.stringify({runs: 0});
    }
    if(!Bingo.get_ls().oobedone) {
        Bingo.prompt_with_instructions();
        Bingo.set_ls('oobedone', true);
    }
    if(!Bingo.get_ls().runs) {
        Bingo.set_ls('runs', 0);
    }
    Bingo.set_ls('runs', Bingo.get_ls().runs+1);
    if(Bingo.get_ls().runs > 3) console.log('I bet Eric is wondering where the directions went...');

    Bingo.bingo_ctr = document.getElementById('bingo-ctr');
    for(let i = 0; i < Bingo.ROWS*Bingo.COLS; i++) {
        Bingo.bingo_ctr.innerHTML += `<div id="tile-${i}" data-index="${i}" class="bingo-tile"></div>`;
    }
    //for(let i in Bingo.bingo_ctr.children) {
    //    Bingo.tiles.push(Bingo.bingo_ctr.children[i]);
    //}
    Bingo.tiles = Bingo.bingo_ctr.children.toArray();
    Bingo.tiles.forEach((element) => {
        //console.log(element);
        applyBlobClipPath(element, '7%');
        element.innerHTML = ``;
        element.addEventListener('click', (evt) => {
            Bingo.on_tile_click(evt);
        });
    });

    fetch(Bingo.request_url())
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            Bingo.questions = data.results;
        })
        .then(() => {
            Bingo.tiles.forEach((element, index) => {
                element.innerHTML = Bingo.questions[index].category;
            });
        });
});
