console.log("Timer module loaded");

let timerInfo = {
    running: false,
    paused: false,
    difference: 0,
    start: 0,
    saved: 0,
    inCountdown: false
}
const timerStartWord = 'go!';
const timerPauseWord = 'pause';
const timerEndWord = 'gg';
const timerCountdownId = 'bsp-timer-buttons-container';
const startButtonId = 'bsp-timer-button-start';
const pauseButtonId = 'bsp-timer-button-pause';
const stopButtonId = 'bsp-timer-button-stop';
const timerElementId = 'bsp-timer-element';

function ensureTimerElements() {
    // check if timer element doesn't exist
    if (!document.getElementById(timerElementId)) {
        const timerElement = document.createElement("div");
        timerElement.id = timerElementId;
        timerElement.innerText = "Loading...";
        const brother = document.getElementsByClassName("board-container")[0];
        const container = document.createElement("div");
        container.id = 'bsp-board-container';
        container.appendChild(timerElement);
        brother.parentElement.appendChild(container);
        container.appendChild(brother);
    }
    // check if countdown button exists
    if (!document.getElementById(timerCountdownId)) {
        const timerContainer = document.createElement("div");
        timerContainer.id = timerCountdownId;

        const firstElement = document.createElement("div");
        firstElement.innerText = "Timer:";
        firstElement.style.fontWeight = 'bold';

        const startButton = document.createElement("div");
        startButton.id = startButtonId;
        startButton.innerText = "Start";
        startButton.className = 'btn btn-default';
        startButton.style.display = timerInfo.running ? 'none' : 'block';
        startButton.onclick = () => {
            if (timerInfo.running || timerInfo.inCountdown) {
                return;
            }
            timerInfo.inCountdown = true;
            countdown();
        }

        const boardCover = document.getElementsByClassName("board-cover")[0];
        if (boardCover.classList.contains("fading")) {
            boardCover.classList.remove('fading');
            boardCover.firstElementChild.innerText = "Click to Reveal";
        }

        const pauseButton = document.createElement("div");
        pauseButton.id = pauseButtonId;
        pauseButton.innerText = "Pause";
        pauseButton.className = 'btn btn-default';
        pauseButton.style.display = timerInfo.running ? 'block' : 'none';
        pauseButton.onclick = () => {
            if (!timerInfo.running && !timerInfo.paused) {
                return;
            }
            sendTextMessage(timerPauseWord);
        }

        const resetButton = document.createElement("div");
        resetButton.innerText = "Stop";
        resetButton.id = stopButtonId;
        resetButton.className = 'btn btn-default';
        resetButton.style.display = timerInfo.running ? 'block' : 'none';
        resetButton.onclick = () => {
            sendTextMessage(timerEndWord);
        }

        timerContainer.appendChild(firstElement)

        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-around';

        buttonsContainer.appendChild(startButton);
        buttonsContainer.appendChild(pauseButton);
        buttonsContainer.appendChild(resetButton);

        timerContainer.appendChild(buttonsContainer);

        const lastElementChild = document.getElementById("room-settings").lastElementChild;
        lastElementChild.insertBefore(timerContainer, lastElementChild.lastElementChild);
    }
}

ensureTimerElements();

function countdown() {
    const offset = 100;
    const difference = 950;
    setTimeout(() => sendTextMessage(`Starting on ${timerStartWord.toUpperCase()}`), offset);
    setTimeout(() => sendTextMessage("Starting in 5..."), offset + difference);
    setTimeout(() => sendTextMessage("Starting in 4..."), offset + 2 * difference);
    setTimeout(() => sendTextMessage("Starting in 3..."), offset + 3 * difference);
    setTimeout(() => sendTextMessage("Starting in 2..."), offset + 4 * difference);
    setTimeout(() => sendTextMessage("Starting in 1..."), offset + 5 * difference);
    setTimeout(() => sendTextMessage(timerStartWord.toUpperCase()), offset + 6 * difference);
}

function formatDuration(diff, trimHours, trimDecimals) {
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    let decimals = Math.floor((diff % 1000) / 100);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    // ${trimDecimals ? '' : `.${decimals}`}
    return `${trimHours && hours === 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
}

function getShowTime() {
    // calculate time
    const updatedTime = Date.now();
    if (timerInfo.saved) {
        timerInfo.difference = (updatedTime - timerInfo.start) + timerInfo.saved;
    } else {
        timerInfo.difference = updatedTime - timerInfo.start;
    }

    document.getElementById(timerElementId).innerHTML = formatDuration(timerInfo.difference, true, false);
}

function startTimer(start) {
    if (!timerInfo.running) {
        if (document.getElementById(startButtonId)) document.getElementById(startButtonId).style.display = 'none';
        if (document.getElementById(pauseButtonId)) document.getElementById(pauseButtonId).style.display = 'block';
        if (document.getElementById(stopButtonId)) document.getElementById(stopButtonId).style.display = 'block';

        timerInfo.start = start;
        timerInfo.tInterval = setInterval(getShowTime, 250);
        timerInfo.inCountdown = false;
        timerInfo.paused = false;
        timerInfo.running = true;
        document.getElementById(timerElementId).className = 'running';

        // reveal card
        const evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        document.getElementsByClassName("board-cover")[0].dispatchEvent(evObj);
    }
    addTimestamps();
}

function pauseTimer() {
    if (timerInfo.running && !timerInfo.paused) {
        if (document.getElementById(startButtonId)) document.getElementById(startButtonId).style.display = 'block';
        if (document.getElementById(pauseButtonId)) document.getElementById(pauseButtonId).style.display = 'none';
        if (document.getElementById(stopButtonId)) document.getElementById(stopButtonId).style.display = 'block';

        clearInterval(timerInfo.tInterval);
        timerInfo.saved = timerInfo.difference;
        timerInfo.running = false;
        timerInfo.paused = true;
        document.getElementById(timerElementId).className = 'paused';
        const boardCover = document.getElementsByClassName("board-cover")[0];
        boardCover.style = 'display: flex; z-index: 4;';
        boardCover.classList.add('fading');
        boardCover.onclick = () => {
            boardCover.onclick = undefined;
            boardCover.style = 'display: none;';
            boardCover.classList.remove("fading");
            boardCover.firstElementChild.innerText = "Click to Reveal";

        }
        boardCover.firstElementChild.innerText = "Game is paused!";
    }
}

function stopTimer() {
    if (document.getElementById(startButtonId)) document.getElementById(startButtonId).style.display = 'block';
    if (document.getElementById(pauseButtonId)) document.getElementById(pauseButtonId).style.display = 'none';
    if (document.getElementById(stopButtonId)) document.getElementById(stopButtonId).style.display = 'none';

    clearInterval(timerInfo.tInterval);
    timerInfo.saved = 0;
    timerInfo.difference = 0;
    timerInfo.paused = false;
    timerInfo.running = false;
    timerInfo.inCountdown = false;
    document.getElementById(timerElementId).className = 'finished';
}

function handleTimerEvent() {
    ensureTimerElements();

    let chatBody = document.getElementsByClassName("chat-body")[0];
    addTimestamps();
    if (!chatBody?.lastChild?.lastChild?.lastChild?.innerText) {
        return;
    }

    const lastMessage = chatBody.lastChild.lastChild;

    switch (lastMessage.lastChild.innerText.toLowerCase()) {
        case timerStartWord:
            startTimer(getRecentDate(getElementChildByClassName(lastMessage, "chat-timestamp").innerText));
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
});

new MutationObserver(checkStatusOnLoad).observe(document.getElementsByClassName("chat-history")[0], {
    attributes: true,
    childList: true,
    subtree: true
});

function getRecentDate(time) {
    let now = new Date();
    const dateString = `${now.getFullYear()}-${(now.getMonth() < 9 ? '0' : '') + (1 + now.getMonth())}-${(now.getDate() < 10 ? '0' : '') + now.getDate()}T${time}`;
    let fullDate = Date.parse(dateString);
    while (fullDate > Date.now()) {
        fullDate -= 24 * 60 * 60 * 1000;
    }
    return fullDate;
}

function checkStatusOnLoad() {
    const chatBody = document.getElementsByClassName("chat-history")[0];
    if (chatBody) {
        for (let i = chatBody.childElementCount - 1; i >= 0; i--) {
            let element = chatBody.childNodes.item(i);
            if (element && element.className === 'chat-entry') {
                let chatEntry = element.firstChild;
                const command = chatEntry.lastChild.innerText.toLowerCase();
                if (!timerInfo.running && command === timerStartWord) {
                    let startTime = chatEntry.firstChild.innerText;
                    let startDate = getRecentDate(startTime);
                    startTimer(startDate);
                    return;
                } else if (command === timerPauseWord || command === timerEndWord) {
                    break;
                }
            }
        }
    }
    const timerElement = document.getElementById(timerElementId);
    timerElement.innerText = "00:00";
}

function addTimestamps() {
    if (!timerInfo.start) {
        return;
    }

    const entries = [
        ...document.getElementsByClassName("chat-entry"),
        ...document.getElementsByClassName("goal-entry"),
        ...document.getElementsByClassName("connection-entry"),
        ...document.getElementsByClassName("revealed-entry")
    ];

    for (const entry of entries) {
        if (entry.firstElementChild.children[0].className !== 'bsp-timestamp') {
            let goalTime = entry.firstChild.firstChild.innerText;
            let goalDate = getRecentDate(goalTime);
            let timestamp = document.createElement("div");
            const time = goalDate - timerInfo.start + (timerInfo.paused ? 0 : timerInfo.saved);
            const displayTimestamp = time >= 0;
            timestamp.innerText = displayTimestamp ? `${formatDuration(time, true, true)}` : '';
            timestamp.className = 'bsp-timestamp';
            if (!displayTimestamp) {
                timestamp.style.marginRight = '0';
            }
            entry.firstChild.insertBefore(timestamp, entry.firstElementChild.children[0]);
        }
    }
}
