let Bingo = {
    DEBUG: true,
    localStorageName: 'jtreed-bingo-trivia',
    get_ls: function () { return JSON.parse(localStorage[this.localStorageName]); },
    set_ls: function (key, value) { localStorage[this.localStorageName] = JSON.stringify(Object.assign({}, this.get_ls(), JSON.parse(`{"${key}": ${JSON.stringify(value)}}`))); },
    ROWS: 5,
    COLS: 5,
    DIALOG_TRANSITION_DURATION_MS: 350,
    DELAY_BETWEEN_ANSWER_AND_SHRINKING_MS: 2000,
    DELAY_BEFORE_DISPLAYING_QUESTION_MS: 500,
    questions: [],
    request_url: function() {
        return `https://opentdb.com/api.php?amount=${this.ROWS*this.COLS}&type=multiple`
    },
    bingo_ctr: null,
    tiles: null,
    dialog_ctr: null,
    dialog: null,
    current_question_index: null,
    current_question_element: null,
    expanded_tile_pos: null,
    slide_dialog_in: function () {
        this.dialog.classList.forEach((cls) => {
            this.dialog.classList.remove(cls);
        });
        this.dialog.classList.remove('correct');
        this.dialog.classList.remove('incorrect');
        this.dialog.style.top = '100%';
        this.dialog.style.left = '0';
        this.dialog.style.width = '100%';
        this.dialog.style.height = '100%';
        this.dialog.style.display = '';
        this.dialog.style.visibility = 'visible';
        applyBlobClipPath(this.dialog, '3%');
        this.dialog.style.transitionDuration = (this.DIALOG_TRANSITION_DURATION_MS / 1000) + 's';
        setTimeout(() => {
            this.dialog.style.top = '0';
        }, 1);
    },
    slide_dialog_out: function () {
        this.dialog.style.top = '100%';
        setTimeout(() => {
            this.dialog.style.top = '';
            this.dialog.style.left = '';
            this.dialog.style.width = '';
            this.dialog.style.height = '';
            this.dialog.style.display = 'none';
            this.dialog.style.visibility = '';
            this.dialog.style.transitionDuration = '';
        }, this.DIALOG_TRANSITION_DURATION_MS + 1);
    },
    prompt_with_instructions: function () {
        this.slide_dialog_in();
        this.dialog.style.padding = '';
        this.dialog.innerHTML = `
            <div id="instructions">
                <h1>Trivia Bingo</h1>
                It's bingo, except you answer trivia questions.<br />
                For debugging, you can shift-click a box to mark it correct or ctrl-click to mark it incorrect.
            </div>
            <div id="commence">Begin</div>
        `;
        let commence = document.getElementById('commence');
        applyBlobClipPath(commence, '3%');
        commence.addEventListener('click', (evt) => {
            this.slide_dialog_out();
        });
    },
    on_tile_click: function (event) {
        if(event.target.classList.contains('correct') || event.target.classList.contains('incorrect')) return;
        if(this.DEBUG) {
            if(event.shiftKey) {
                event.target.classList.add('correct');
                if(this.check_for_win()) {
                    this.handle_win();
                }
                return;
            }
            if(event.ctrlKey) {
                event.target.classList.add('incorrect');
                return;
            }
        }
        this.expand_tile(event.target);
    },
    expand_tile: function (element) {
        this.current_question_element = element;
        this.current_question_element.innerHTML = `<div class="category">${element.innerHTML}</div>`;
        try {
            this.current_question_index = ~~(this.current_question_element.outerHTML.match(/^<div id="tile-([0-9]+)/)[1])
        } catch (e) {
            /* give up, this stops the error when clicking on an already-answered question */
            return;
        }
        this.dialog_ctr.innerHTML = this.current_question_element.outerHTML.replace(/^<div id="tile-[0-9]+/, (i) => i + '-expanded');
        this.dialog = this.dialog_ctr.children[0];
        this.expanded_tile_pos = this.current_question_element.getBoundingClientRect();

        this.dialog.style.top = this.expanded_tile_pos.top + 'px';
        this.dialog.style.left = this.expanded_tile_pos.left + 'px';
        this.dialog.style.width = this.expanded_tile_pos.width + 'px';
        this.dialog.style.height = this.expanded_tile_pos.height + 'px';
        this.dialog.style.padding = '0';
        this.dialog.style.background = window.getComputedStyle(this.current_question_element).backgroundColor;
        this.dialog.style.display = '';
        this.dialog_ctr.style.visibility = 'visible';
        this.current_question_element.style.visibility = 'hidden';

        // wait until the above styles are applied so they happen instantly
        setTimeout(() => {
            this.dialog.style.transitionDuration = (this.DIALOG_TRANSITION_DURATION_MS / 1000) + 's';
            // now the transition to bigness will be smooth
            this.dialog.style.top = '0';
            this.dialog.style.left = '0';
            this.dialog.style.width = '100%';
            this.dialog.style.height = '100%';
            this.dialog.style.padding = '';
            this.dialog.style.background = '';
            applyBlobClipPath(this.dialog, '3%');
        }, 1);
        setTimeout(() => {
            this.display_question();
        }, this.DIALOG_TRANSITION_DURATION_MS + this.DELAY_BEFORE_DISPLAYING_QUESTION_MS + 1);
    },
    shrink_dialog: function () {
        this.dialog.innerHTML = '';
        this.dialog.style.top = this.expanded_tile_pos.top + 'px';
        this.dialog.style.left = this.expanded_tile_pos.left + 'px';
        this.dialog.style.width = this.expanded_tile_pos.width + 'px';
        this.dialog.style.height = this.expanded_tile_pos.height + 'px';
        this.dialog.style.padding = '0';
        // take care of this when they get the answer right or wrong
        //this.dialog.style.background = window.getComputedStyle(this.current_question_element).backgroundColor;
        this.dialog.style.clipPath = this.current_question_element.style.clipPath;
        setTimeout(() => {
            this.dialog_ctr.style.visibility = '';
            this.current_question_element.style.visibility = '';
            this.dialog.style.top = '';
            this.dialog.style.left = '';
            this.dialog.style.width = '';
            this.dialog.style.height = '';
            this.dialog.style.transitionDuration = '';
            this.dialog.style.display = 'none';

        }, this.DIALOG_TRANSITION_DURATION_MS + 1);
    },
    display_question: function () {
        this.dialog.innerHTML = JSON.stringify(this.questions[this.current_question_index]);
        let q = this.questions[this.current_question_index];
        //console.log(q);
        let options = [];
        options.push(q.correct_answer);
        for (let i = 0; i < q.incorrect_answers.length; i++) {
            options.push(q.incorrect_answers[i]);
        }
        options.shuffle();
        //console.log(options);
        this.dialog.innerHTML = `<div id="question">${q.question}</div>`;
        options.forEach((optionText, index) => {
            this.dialog.innerHTML += `<div class="option" id="option${index}" data-value="${optionText}">${optionText}</div>`;
        });
        // store the correct answer in an element identically to how it's stored in the correct answer option above,
        // so that we can compare strings without having to worry about HTML entities being encoded or not
        this.dialog.innerHTML += `<div class="hidden" id="correct-answer" data-value="${q.correct_answer}">${q.correct_answer}</div>`;
        options.forEach((optionText, index) => {
            let element = document.getElementById(`option${index}`);
            applyBlobClipPath(element, '10%');
            element.addEventListener('click', (evt) => { this.process_answer(evt); });
        });
    },
    process_answer: function (event) {
        let q = this.questions[this.current_question_index];
        if (event.target === this.get_correct_element()) this.mark_correct(event.target);
        else this.mark_incorrect(event.target);
        setTimeout((evt) => {
            this.shrink_dialog();
        }, this.DELAY_BETWEEN_ANSWER_AND_SHRINKING_MS);
        if(this.check_for_win()) {
            this.handle_win();
        }
    },
    mark_correct: function (selectedElement) {
        this.dialog.classList.remove('incorrect');
        this.dialog.classList.add('correct');
        selectedElement.classList.add('correct');
        this.current_question_element.classList.remove('incorrect');
        this.current_question_element.classList.add('correct');
        this.current_question_element.innerHTML = '';
    },
    mark_incorrect: function (selectedElement) {
        this.dialog.classList.remove('correct');
        this.dialog.classList.add('incorrect');
        selectedElement.classList.add('incorrect');
        this.current_question_element.classList.remove('correct');
        this.current_question_element.classList.add('incorrect');
        this.current_question_element.innerHTML = '';
        this.get_correct_element().classList.add('correct');
    },
    get_correct_element: function () {
        let right;
        this.dialog.children.toArray().forEach((element) => {
            if (element.classList.contains('option') && element.dataset.value === document.getElementById('correct-answer').dataset.value) {
                // console.log(element);
                right = element;
            }
        });
        return right;
    },
    check_for_win: function () {
        let answers = this.tiles.map((element) => element.classList.contains('correct'));
        let needed = Math.min(this.ROWS, this.COLS);
        let checkCountAtInterval = (array, start, count, interval) => {
            for (let i = start, c = 0; i < array.length && c < count; i += interval, c++) {
                if (!array[i]) return false;
            }
            return true;
        };
        for (let i = 0; i < this.COLS; i++) {
            if (checkCountAtInterval(answers, i, this.ROWS, this.COLS)) return true;
        }
        for (let i = 0; i < this.ROWS * this.COLS; i += this.COLS) {
            if (checkCountAtInterval(answers, i, this.COLS, 1)) return true;
        }
        // check diagonals
        if (checkCountAtInterval(answers, 0, needed, this.COLS + 1)) return true;
        if (checkCountAtInterval(answers, 0, needed, this.COLS + 1)) return true;
        if (checkCountAtInterval(answers, this.COLS * (this.ROWS - 1), needed, -this.COLS + 1)) return true;
        if (checkCountAtInterval(answers, (this.COLS * this.ROWS) - 1, needed, -this.COLS - 1)) return true;

        return false;
    },
    handle_win: function () {
        console.log('User finally won');
        this.slide_dialog_in();
        this.dialog.style.padding = '';
        this.dialog.innerHTML = `
            <div id="congratulations">
                <h1>Congratulations!</h1>
                The creator still hasn't beaten this game without cheating. Good work.
            </div>
            <div id="recommence">Play again</div>
        `;
        let recommence = document.getElementById('recommence');
        applyBlobClipPath(recommence, '3%');
        recommence.addEventListener('click', (evt) => {
            window.location = window.location;
        });
    }
};