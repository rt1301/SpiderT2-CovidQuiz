var sideMenu = document.getElementById("side-menu");
var pageNum = document.getElementById("page-num");
var main = document.getElementById("main");
var leftBtn = document.getElementById('left');
var rightBtn = document.getElementById('right');
var answer = document.querySelector('.answer');
var explanation = document.querySelector('.explanation');
var scoreBoard = document.getElementById("scoreDisplay");
var nameDisplay = document.getElementById("nameDisplay");
var checkedOption;
var Optionlist = document.getElementsByClassName('option');
var quiz;
var quizArea = document.querySelector(".quiz-area");
var intro = document.querySelector('.intro');
var nameInput = document.getElementById('name');
var startBtn  = document.getElementById("start");
var name;
var answerLink;
var ss_keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
var bestScoreCount = [];
var index = 0;
var start = true;
var sec,ms,count,sec_alt,ms_alt;
var burger = document.querySelector('.burger');
var closeBtn = document.querySelector('.btn-close');
var bestScore = document.getElementById("bestScore");
var end = false;
function startQuiz()
{
    nameInput.addEventListener('input',()=>{
        name = nameInput.value;
    });
    startBtn.addEventListener('click',()=>{
        sessionStorage.clear();
        intro.classList.add('hide');
        quizArea.classList.remove('hide');
        stopwatch.stop();
        stopwatch.start();
    });
}
const quizQues = async function() {
    if(start)
    {
        const res = await fetch("./quiz.json");
        quiz = await res.json();
        shuffle(quiz);
        sideNavList();
        sideNavEventListener();
        start = false;
    }
    quizDisplay(pageNum.textContent);
    chooseOption();
    modalDisplay(Number(pageNum.textContent));
    checkedButton();
}
function endGame()
{
    if(end)
    {
        quizArea.classList.add('hide');
        document.querySelector('.endGame').classList.remove('hide');
        calcScore();
        document.querySelector('.score').classList.remove('hide');
        document.querySelector('.participant').classList.remove('hide');
        stopwatch.stop();
    }
    end =  false;
}
// StopWatch Function
var stopwatch = 
{
  start: function()
  {
    ms = 0;
    sec = 120;
    count = setInterval(function()
    {
      if(ms == 0)
      {
        ms = 99;
        sec--;
      }
      else
      {
        ms--;
      }
      sec_alt = stopwatch.display(sec);
      ms_alt = stopwatch.display(ms);

      stopwatch.update(sec_alt + ":" + ms_alt);
      if((sec == 0 && ms == 0) || (sessionStorage.length === 10))
    {
        end = true;
        endGame();
        stopwatch.stop();
    }
    },10);
  },
  stop: function()
  {
    clearInterval(count);
  },
  update: function(txt)
  {
    var temp = document.getElementById("timer");
    temp.firstChild.nodeValue = txt;
  },
  display: function(time)
  {
    var temp;
    if(time < 10)
    {
      temp = "0" + time;
    }
    else
    {
      temp = time;
    }
    return temp;
    
  }
};
function sideNavList() {
    for (var i = 0; i < quiz.length; i++) {
        var link = document.createElement('a');
        link.innerHTML = `<span id='q${i+1}' class='nav-index'>${i+1}</span>.  ${quiz[i].question}`;
        sideMenu.appendChild(link);
    }
    burger.addEventListener('click',()=>{
        sideMenu.style.width = '400px';
        document.querySelector('section').style.marginRight = '400px';
    });
    closeBtn.addEventListener('click',()=>{
        sideMenu.style.width = '0px';
        document.querySelector('section').style.marginRight = '0px';
    });
}

function sideNavEventListener()
{
    var navLinks = document.querySelectorAll(".side-nav a");
    for(var i=1;i<navLinks.length;i++)
    {
        navLinks[i].addEventListener('click',(e)=>{
            var index = e.srcElement.childNodes[0].innerText;
            pageNum.textContent = index;
            quizQues();
            calcScore();
        });
    }
}
// Fisher-Yates Shuffle Algorithm
function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
function modalDisplay(option) {
    var modalBtn = document.querySelector('#submitBtn');
    var modalBg = document.querySelector(".modal-bg");
    var close = document.querySelector(".modal-close");
    var answerIndex = quiz[option - 1].answer;
    var expl = quiz[option - 1].explanation;
    answerLink = document.getElementById(`q${option}`);
    explanation.innerHTML = '<strong class="title">Explanation: </strong>' + expl;
    modalBtn.addEventListener('click', () => {
        chooseOption();
        sessionStorage.setItem(ss_keys[pageNum.textContent - 1], checkedOption);
        modalBg.classList.add('bg-active');
        if(sessionStorage.getItem(`q${pageNum.textContent}`))
        {
            var parent = document.getElementById(`q${pageNum.textContent}`).closest('a');
            parent.style.border = '2px solid white';
            parent.style.fontWeight = '700';
        }
        if(sessionStorage.length === 10 || end)
        {
            calcScore();
            document.querySelector('.score').classList.remove('hide');
            document.querySelector('.participant').classList.remove('hide');
            endGame();
        }
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
        answerLink = '';
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
    for (var i = 0; i < sessionStorage.length; i++) {
        items[i] = sessionStorage.getItem(ss_keys[i]);
        if (items[i] === quiz[i].options[quiz[i].answer]) {
            score++;
        }
    }
    if(sessionStorage.length === 10 || end)
    {
        var time = sec;
        if(time >=90)
        {
            score = score*5;
        }
        else if(time >=70)
        {
            score = score*3;
        }
        else if(time>=50)
        {
            score = score*2;
        }
        var storedScore = 0;
        if(score.toString().length === 1)
        {
            storedScore = '0' + score.toString();
        }
        else
        {
            storedScore = score.toString();
        }
        var date = new Date();
        var storedInfo = storedScore + ' ' + date.toString();
        localStorage.setItem(name,storedInfo);
        displayScore(score);
    }
}

function checkedButton() {
    if (sessionStorage.getItem(`q${pageNum.textContent}`)) {
        var selected = sessionStorage.getItem(`q${pageNum.textContent}`);
        document.querySelector(`input[value="${selected}"]`).checked = true;
    }
}

function displayScore(score) {
    scoreBoard.innerText = score;
    nameDisplay.innerText = name;
    bestScoreCount.push(localStorage.getItem(name).substring(0,2));
    bestScoreCount.sort();
    var best = bestScoreCount[bestScoreCount.length - 1];
    bestScore.innerText = best;
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
            num = 0;
            return;
        }
        return;
    });
    rightBtn.addEventListener('click', () => {
        if (Number(pageNum.textContent) < quiz.length) {
            var num = Number(pageNum.textContent);
            num++;
            pageNum.textContent = num;
            quizQues();
            calcScore();
        } else {
            num = 0;
            return;
        }
        return;
    });
}
function restart()
{
    end = false;
    document.querySelector('.endGame').classList.add('hide');
    intro.classList.remove('hide');
    nameDisplay.classList.add('hide');
    scoreBoard.classList.add('hide');
    sessionStorage.clear();
    nameDisplay.classList.remove('hide');
    scoreBoard.classList.remove('hide');
    sideMenu.innerHTML = '<a href="#" class="btn-close">&times;</a>';
    closeBtn.addEventListener('click',()=>{
        sideMenu.style.width = '0px';
        document.querySelector('section').style.marginRight = '0px';
    });
    shuffle(quiz);
    init();
    start = false;
}
function init()
{
    count = 0;
    sec = 10;
    ms = 0;
    score = 0;
    start  = true;
    pageNum.innerText = '1';
    startQuiz();
    document.getElementById("restart").addEventListener('click',()=>{
        restart();
        sessionStorage.clear();
    })
}
pageNav();
init();