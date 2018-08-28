var storage = chrome.storage.local;
//

var key = 'JOHN';

var id = document.location.pathname;

var articleBody = document.getElementsByClassName('js-article__body')[0];
var questionDiv = document.createElement("div");
questionDiv.className = 'question';

// make a blank storage zone
//var stored = {};
//stored[key] = JSON.stringify({});
//storage.set(stored);

var pledgeIncrement = 0.2;//20 pence
var pledgePaymentThreshold = 2;//£2.00

// log it
chrome.storage.local.get(function(data) {console.log(data);});


function add(clazz, text) {
    var question = document.createElement('div');
    var questionText = document.createTextNode(text);
    question.className = clazz;

    question.appendChild(questionText);
    return question;
}

function addPledge(roundel) {
    roundel.className = 'question__answer js-answer';

    roundel.addEventListener('click', function () {
        storage.get(key, function (stored) {
            var clicks = JSON.parse(stored[key]);
            console.log("hi1", clicks);
            clicks[id] = clicks[id] ? clicks[id] + 1 : 1;
            console.log("hi2", clicks);
            var total = Object.values(clicks).reduce(function (a, b) {
                return a + b
            }, 0);
            stored[key] = JSON.stringify(clicks);
            storage.set(stored);
            updateTotals()
        });
    });

    return roundel;
}

function updateTotals() {
    storage.get(key, function (stored) {
        var clicks = JSON.parse(stored[key]);
        console.log("hi", clicks);
        var ourclicks = clicks[id] ? clicks[id] : 0;
        var total = Object.values(clicks).reduce(function (a, b) { return a + b}, 0);

        if (total * pledgeIncrement >= pledgePaymentThreshold) {
            Array.prototype.forEach.call(document.getElementsByClassName('js-thanks'), function (answer) {
                answer.style.display = 'block';
                // make the amount spot on rather than just 2 pounts
                answer['amount'] = total * pledgeIncrement
            });
        }

        Array.prototype.forEach.call(document.getElementsByClassName('js-totals'), function (answer) {
            answer.textContent = "you have pledged "+ourclicks + " times to this article and " + total + " overall";
        });

    });

}

function addThanks(clazz, text) {
    var wrap = document.createElement('div');
    wrap.className = clazz;

    var why = document.createElement('a');
    why.href = '#';
    why.addEventListener('click', function (event) {
        location.href = 'https://support.theguardian.com/contribute/one-off?contributionValue='+wrap['amount']+'&contribType=ONE_OFF&currency=GBP';

        // make a blank storage zone
        var stored = {};
        stored[key] = JSON.stringify({});
        storage.set(stored);

        event.preventDefault()
    });

    var whyText = document.createTextNode(text);
    why.className = 'question__thanks js-thanks-text';

    why.appendChild(whyText);

    wrap.appendChild(why);
    return wrap;
}

function addTotals(clazz, text) {
    var wrap = document.createElement('div');
    wrap.className = clazz;

    var why = document.createElement('a');
    why.href = 'http://membership.theguardian.com/';

    var whyText = document.createTextNode(text);
    why.className = 'question__totals js-totals';

    why.appendChild(whyText);

    wrap.appendChild(why);
    return wrap;
}

function addButton() {

    var roundel = document.createElement('img');
    roundel.className = 'roundel_button';
    roundel.src = chrome.extension.getURL("Guardian_roundel_black.png");

    addPledge(roundel);

    return roundel;
}

questionDiv.appendChild(add('mp-support', "Show your support for this article"));
questionDiv.appendChild(add('mp-support2', "Click to pledge a contribution. £0.20 for each click"));
questionDiv.appendChild(add('mp-support3', "We'll ask for payment, for you total pledge, at the end of the month"));
questionDiv.appendChild(addButton());
questionDiv.appendChild(add('mp-support4', "Pledge £0.20"));

questionDiv.appendChild(addThanks('question__thanks__wrapper js-thanks', "thanks!!!"));
questionDiv.appendChild(addTotals('question__totals__wrapper', "the totals will appear here..."));

articleBody.appendChild(questionDiv);
updateTotals();