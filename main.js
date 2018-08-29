var storage = chrome.storage.local;
//

var key = 'myPledges';

var okey = 'othersPledges';

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
    roundel.addEventListener('click', function () {
        storage.get(key, function (stored) {
            var clicks = stored[key] ? JSON.parse(stored[key]) : {};
            console.log("hi1", clicks);
            clicks[id] = clicks[id] ? clicks[id] + 1 : 1;
            console.log("hi2", clicks);
            var total = Object.values(clicks).reduce(function (a, b) {
                return a + b
            }, 0);
            stored[key] = JSON.stringify(clicks);
            storage.set(stored);
            updateTotals(true)
        });
    });

    return roundel;
}


function updateTotals(pledgeShouldBeUpdated) {
    if(pledgeShouldBeUpdated){
        updatePersonalTotals();
    }else{
        updateGlobalTotals();
    }
}

function updatePersonalTotals() {
    storage.get([key, okey], function (stored) {
        var clicks = stored[key] ? JSON.parse(stored[key]) : {};
        var ourclicks = clicks[id] ? clicks[id] : 0;
        var total = Object.values(clicks).reduce(function (a, b) {
            return a + b
        }, 0);

        if (total * pledgeIncrement >= pledgePaymentThreshold) {
            Array.prototype.forEach.call(document.getElementsByClassName('js-thanks'), function (answer) {
                answer.style.display = 'block';
                // make the amount spot on rather than just 2 pounts
                answer['amount'] = (total * pledgeIncrement).toFixed(2)
            });
        }

        var otherclicks = stored[okey] ? JSON.parse(stored[okey]) : 0;
        Array.prototype.forEach.call(document.getElementsByClassName('js-totals'), function (answer) {
            while (answer.firstChild) {
                answer.firstChild.remove();
            }

            var added = document.createElement('div');
            var addedText1 = document.createTextNode("you have pledged ");
            var addedSpan = document.createElement('span');
            addedSpan.appendChild(document.createTextNode(renderAmount(ourclicks)));
            var addedText2 = document.createTextNode(" to this article");
            added.className = "answer__total__article";

            added.appendChild(addedText1);
            added.appendChild(addedSpan);
            added.appendChild(addedText2);

            answer.appendChild(added);
            answer.appendChild(add("answer__total__overall", "and " + renderAmount(total) + " overall"));
            answer.appendChild(add("answer__total__others", "Overall pledges on theguardian.com this week are " + renderAmount(otherclicks)));
        });

    });

}
function updateGlobalTotals(pledgeShouldBeUpdated) {
    storage.get([key, okey], function (stored) {

        var otherclicks = stored[okey] ? JSON.parse(stored[okey]) : 0;
        Array.prototype.forEach.call(document.getElementsByClassName('js-totals'), function (answer) {
            answer.replaceChild(add("answer__total__others", "Overall pledges on theguardian.com this week are " + renderAmount(otherclicks)),answer.lastChild);
        });

    });

}

function renderAmount(clicks) {
    return "£" + (clicks * pledgeIncrement).toFixed(2)
}

function addThanks(clazz, text) {
    var wrap = document.createElement('div');
    wrap.className = clazz;

    var why = document.createElement('a');
    why.href = '#';
    why.addEventListener('click', function (event) {
        location.href = 'https://support.theguardian.com/contribute/one-off?contributionValue='+wrap['amount']+'&contribType=ONE_OFF&currency=GBP';

        // make a blank storage zone
        storage.get(key, function (stored) {
            stored[key] = JSON.stringify({});
            storage.set(stored);
        });

        event.preventDefault()
    });

    var whyText = document.createTextNode(text);
    why.className = 'question__thanks js-thanks-text contributions__option-button contributions__contribute contributions__contribute--epic contributions__contribute--epic-member contributions__contribute--epic-single-button';

    why.appendChild(whyText);

    wrap.appendChild(why);
    return wrap;
}

function addTotals(clazz, text) {
    var wrap = document.createElement('div');
    wrap.className = clazz;

    var why = document.createElement('p');

    var whyText = document.createTextNode(text);
    why.className = 'question__totals js-totals';

    why.appendChild(whyText);

    wrap.appendChild(why);
    return wrap;
}

function addButton() {

    var roundeldivouter = document.createElement('div');
    var roundeldiv = document.createElement('div');
    var roundel = document.createElement('img');
    roundel.src = chrome.extension.getURL("Guardian_roundel_black.png");

    roundeldiv.className = 'question__answer';
    roundeldivouter.className = 'question__answer__outer';
    roundel.className = 'question__roundel js-answer';

    addPledge(roundel);
    roundeldivouter.appendChild(roundel);
    roundeldivouter.appendChild(roundeldiv);
    return roundeldivouter;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function addPledgeFromOthers(number) {

    storage.get(okey, function (stored) {
        var clicks = stored[okey];
        console.log("OTHERS1", clicks);
        clicks = clicks ? clicks + number : number;
        console.log("OTHERs2", clicks);

        stored[okey] = clicks;
        storage.set(stored);
        updateTotals();
        setTimeout(function () {addPledgeFromOthers(getRandomInt(200))}, getRandomInt(2000));
    });
}

questionDiv.appendChild(add('question__title', "Show your support for free..."));

questionDiv.appendChild(add('mp-support', "The Guardian’s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we believe our perspective matters – because it might well be your perspective, too."));
questionDiv.appendChild(add('mp-support2', "Your contributions help us survive, but even if you're not in a position to contribute, you can show your support by clicking the G."));
questionDiv.appendChild(add('mp-support-highlight', "Each click adds just 20p"));
questionDiv.appendChild(add('mp-support3', " to your pledge total and you can clear it any time you like, once you reach £2"));
questionDiv.appendChild(addButton());
questionDiv.appendChild(add('mp-support4', "Pledge £0.20"));

questionDiv.appendChild(addTotals('question__totals__wrapper', "the totals will appear here..."));
questionDiv.appendChild(addThanks('question__thanks__wrapper js-thanks ', "Turn your pledge into a one off contribution"));

articleBody.appendChild(questionDiv);
updateTotals(true);

setTimeout(function () {addPledgeFromOthers(getRandomInt(10))}, getRandomInt(3000));