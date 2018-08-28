var storage = chrome.storage.local;
storage.clear;

var key = 'JOHN';

var id = document.location.pathname;

var articleBody = document.getElementsByClassName('js-article__body')[0];
var questionDiv = document.createElement("div");
questionDiv.className = 'question';

// make a blank storage zone
var stored = {};
stored[key] = JSON.stringify({});
storage.set(stored);

// log it
chrome.storage.local.get(function(data) {console.log(data);});


function add(clazz, text) {
    var question = document.createElement('div');
    var questionText = document.createTextNode(text);
    question.className = clazz;

    question.appendChild(questionText);
    return question;
}

function answer(link) {
    link.className = 'question__answer js-answer';

    link.addEventListener('click', function () {
        storage.get(key, function (stored) {
            var clicks = JSON.parse(stored[key]);
            clicks[id] = 'clicked';
            stored[key] = JSON.stringify(clicks);
            storage.set(stored);
            Array.prototype.forEach.call(document.getElementsByClassName('js-answer'), function (answer) {
                answer.style.display = 'none';
            });

            Array.prototype.forEach.call(document.getElementsByClassName('js-thanks'), function (answer) {
                answer.style.display = 'block';
            });

            Array.prototype.forEach.call(document.getElementsByClassName('js-thanks-text'), function (answer) {
                answer.textContent = "hohohoho "+stored;
            });

            chrome.storage.local.get(function(data) {console.log(data);});
        });
        chrome.storage.local.get(function(data) {console.log(data);});
    });

    return link;
}

function addThanks(clazz, text) {
    var wrap = document.createElement('div');
    wrap.className = clazz;

    var why = document.createElement('a');
    why.href = 'http://membership.theguardian.com/';

    var whyText = document.createTextNode(text);
    why.className = 'question__thanks js-thanks-text';

    why.appendChild(whyText);

    wrap.appendChild(why);
    return wrap;
}

function addButton() {

    var roundel = document.createElement('img');
    roundel.className = 'roundel_button';
    roundel.src = chrome.extension.getURL("Guardian_roundel_black.png");

    answer(roundel);

    return roundel;
}

var questionData = questions[id];

questionDiv.appendChild(add('question__text', "Click the G if you feel this article was worthwhile"));
questionDiv.appendChild(addButton());
questionDiv.appendChild(addThanks('question__thanks__wrapper js-thanks', "thanks!!!"));

articleBody.appendChild(questionDiv);