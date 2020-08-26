var sideMenu = document.getElementById("side-menu");
var pageNum = document.getElementById("page-num");
var main = document.getElementById("main");
var leftBtn = document.getElementById('left');
var rightBtn = document.getElementById('right');
var answer = document.querySelector('.answer');
var explanation = document.querySelector('.explanation');
var scoreBoard = document.getElementById("scoreDisplay");
var checkedOption;
var Optionlist = document.getElementsByClassName('option');
var quiz;
var ls_keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
var index = 0;
const quizQues = async function() {
    const res = await fetch("./quiz.json");
    const num = pageNum.textContent;
    quiz = await res.json();
    sideNavList();
    quizDisplay(num);
    chooseOption();
    modalDisplay(Number(pageNum.textContent));
    checkedButton();
}

function sideNavList() {
    for (var i = 0; i < quiz.length; i++) {
        var link = document.createElement('a');
        link.textContent = `${i+1}. ${quiz[i].question}`;
        sideMenu.appendChild(link);
    }
}

function modalDisplay(option) {
    var modalBtn = document.querySelector('#submitBtn');
    var modalBg = document.querySelector(".modal-bg");
    var close = document.querySelector(".modal-close");
    var answerIndex = quiz[option - 1].answer;
    var expl = quiz[option - 1].explanation;
    explanation.innerHTML = '<strong class="title">Explanation: </strong>' + expl;
    modalBtn.addEventListener('click', () => {
        chooseOption();
        sessionStorage.setItem(ls_keys[pageNum.textContent - 1], checkedOption);
        modalBg.classList.add('bg-active');
        if (checkedOption === quiz[option - 1].options[answerIndex]) {
            var output = "Correct Answer";
            answer.innerHTML = '<i class="far fa-check-circle"></i>  ' + output;
            answer.classList.add('correct');
            answer.classList.remove('wrong');
        } else {
            var output = "Incorrect Answer";
            answer.innerHTML = '<i class="far fa-times-circle"></i>  ' + output;
            answer.classList.remove('correct');
            answer.classList.add('wrong');
        }
    });
    close.addEventListener('click', () => {
        modalBg.classList.remove('bg-active');
    });
}

function quizDisplay(option) {
    var output = `<div class='image'><img class="quiz-img" src=${quiz[option-1].img}></div><div class="question">${option}. ${quiz[option-1].question}</div>`;
    var optionLength = Object.keys(quiz[option - 1].options).length;
    var optionStr = '<div class="option-container">';
    for (var i = 0; i < optionLength; i++) {
        var optionData = quiz[option - 1].options[i + 1];
        optionStr += `<div class="options"><input class='option question${i+1}' id='q${option}_op${i+1}' type="radio" name="options" value='${quiz[option - 1].options[i + 1]}'>   <label class='option${i+1}'>${quiz[option - 1].options[i + 1]}</label></div><br>`;
    }
    optionStr += "</div>"
    output += optionStr;
    main.innerHTML = output;
}

function chooseOption() {
    for (var i = 0; i < Optionlist.length; i++) {
        if (Optionlist[i].checked) {
            checkedOption = Optionlist[i].value;
        }
    }

}

function calcScore() {
    var items = [];
    var score = 0;
    for (var i = 0; i < sessionStorage.length - 1; i++) {
        items[i] = sessionStorage.getItem(ls_keys[i]);
        if (items[i] === quiz[i].options[quiz[i].answer]) {
            score++;
        }
    }
    displayScore(score);
}

function checkedButton() {
    if (sessionStorage.getItem(`q${pageNum.textContent}`)) {
        var selected = sessionStorage.getItem(`q${pageNum.textContent}`);
        console.log(document.querySelector("input[value='" + selected + "']"));
        document.querySelector(`input[value="${selected}"]`).checked = true;
    }
}

function displayScore(score) {
    scoreBoard.innerText = score;
}

function pageNav() {
    quizQues();
    leftBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) > 1) {
            var num = Number(pageNum.textContent);
            num--;
            pageNum.textContent = num;
            quizQues();
            calcScore();
        } else {
            return;
        }
    });
    rightBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) < quiz.length) {
            var num = Number(pageNum.textContent);
            num++;
            pageNum.textContent = num;
            quizQues();
            calcScore();
        } else {
            return;
        }
    });
}
pageNav();