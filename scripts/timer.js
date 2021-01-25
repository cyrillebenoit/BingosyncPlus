console.log("Timer module loaded");

let timerInfo = {
    running: false,
    paused: false,
    difference: 0,
    start: 0,
    saved: 0
}
const timerStartWord = '1';
const timerPauseWord = 'pause';
const timerEndWord = 'gg';
const timerElementId = 'bsp-timer-element';

function createTimerElement() {
    // check if timer element doesn't exist
    if (!document.getElementById(timerElementId)) {
        const timerElement = document.createElement("div");
        timerElement.id = timerElementId;
        timerElement.innerText = "0:00:00.0";
        const brother = document.getElementsByClassName("board-container")[0];
        brother.parentElement.insertBefore(timerElement, brother)
    }
}

createTimerElement();

function getShowTime() {
    // calculate time
    const updatedTime = Date.now();
    if (timerInfo.saved) {
        timerInfo.difference = (updatedTime - timerInfo.start) + timerInfo.saved;
    } else {
        timerInfo.difference = updatedTime - timerInfo.start;
    }

    let hours = Math.floor((timerInfo.difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timerInfo.difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timerInfo.difference % (1000 * 60)) / 1000);
    let decimals = Math.floor((timerInfo.difference % 1000) / 100);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    document.getElementById(timerElementId).innerHTML = hours + ':' + minutes + ':' + seconds + ':' + decimals;
}

function startTimer() {
    if (!timerInfo.running) {
        timerInfo.start = Date.now();
        timerInfo.tInterval = setInterval(getShowTime, 50);
        timerInfo.paused = false;
        timerInfo.running = true;
        document.getElementById(timerElementId).className = 'running';

        // reveal card
        const evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        document.getElementsByClassName("board-cover")[0].dispatchEvent(evObj);
    }
}

function pauseTimer() {
    if (!timerInfo.difference) {
        // if timer never started, don't allow pause button to do anything
    } else if (!timerInfo.paused) {
        clearInterval(timerInfo.tInterval);
        timerInfo.saved = timerInfo.difference;
        timerInfo.running = false;
        timerInfo.paused = true;
        document.getElementById(timerElementId).className = 'paused';
    }
}

function stopTimer() {
    clearInterval(timerInfo.tInterval);
    timerInfo.saved = 0;
    timerInfo.difference = 0;
    timerInfo.paused = false;
    timerInfo.running = false;
    document.getElementById(timerElementId).className = 'finished';
}

function handleTimerEvent() {
    let chatBody = document.getElementsByClassName("chat-body")[0];
    const lastMessage = chatBody.lastChild.lastChild.lastChild.innerText;

    switch (lastMessage.toLowerCase()) {
        case timerStartWord:
            startTimer();
            break;
        case timerPauseWord:
            pauseTimer();
            break;
        case timerEndWord:
            stopTimer();
            break;
    }
}

new MutationObserver(handleTimerEvent).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})
