var sideMenu = document.getElementById("side-menu");
var pageNum = document.getElementById("page-num");
var main = document.getElementById("main");
var leftBtn = document.getElementById('left');
var rightBtn = document.getElementById('right');
var answer = document.querySelector('.answer');
var explanation = document.querySelector('.explanation');
var checkedOption;
var Optionlist = document.getElementsByClassName('option');
var quiz;
const quizQues = async function() {
    const res = await fetch("./quiz.json");
    const num = pageNum.textContent;
    quiz = await res.json();
    sideNavList();
    quizDisplay(num);
    chooseOption();
    modalDisplay(Number(pageNum.textContent));
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
    var answerIndex = quiz[0].answer;
    var expl = quiz[option - 1].explanation;
    explanation.innerHTML = '<strong class="title">Explanation </strong>' + expl;
    modalBtn.addEventListener('click', () => {
        chooseOption();
        modalBg.classList.add('bg-active');
        console.log(checkedOption);
        if (checkedOption === quiz[option - 1].options[answerIndex]) {
            var output = "Correct Answer";
            answer.innerHTML = output;
        } else {
            var output = "InCorrect Answer";
            answer.innerHTML = output;
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
        optionStr += `<div class="options"><input class='option' type="radio" name="options" value='${quiz[option - 1].options[i + 1]}'>   <label class='option${i+1}'>${quiz[option - 1].options[i + 1]}</label></div><br>`;
    }
    optionStr += "</div>"
    output += optionStr;
    main.innerHTML = output;
}

function chooseOption() {
    for (var i = 0; i < Optionlist.length; i++) {
        if (Optionlist[i].checked) {
            checkedOption = Optionlist[i].value;
            console.log(Optionlist[i]);
        }
    }

}

function pageNav() {
    quizQues();
    leftBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) > 1) {
            var num = Number(pageNum.textContent);
            num--;
            pageNum.textContent = num;
            quizQues();
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
        } else {
            return;
        }
    });
}
pageNav();