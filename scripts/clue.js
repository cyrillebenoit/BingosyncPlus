function eventStopper(e) {
    e.preventDefault();
    if (this === e.target)
        e.stopPropagation();
}

let enableClue = false;
let progress = new Array(25)

function reveal(i, e) {
    // delete sheet
    const sheet = document.getElementById(`sheet${i}`);
    sheet.parentElement.removeChild(sheet);
    e.stopPropagation();

    const evObj = document.createEvent('Events');
    evObj.initEvent('click', true, false);
    document.getElementById(`slot${i}`).dispatchEvent(evObj);
}

function cross(i, j, e) {
    e.stopPropagation();
    e.preventDefault();
    const element = document.getElementById(`slot${i}_option${j}`);
    const isCrossed = element.className === 'crossed';
    element.className = isCrossed ? '' : 'crossed';
    progress[i - 1][j] = !isCrossed;
}

function updateSheets() {
    if (!enableClue) {
        // for each slot
        for (let i = 1; i <= 25; i++) {
            const sheet = document.getElementById(`sheet${i}`);
            if (sheet !== null) {
                sheet.parentElement.removeChild(sheet);
            }
        }
        return;
    }
    if (listsA === []) {
        console.log("Main list isn't set")
        return;
    }

    try {
        if (listsA.length !== 25) {
            throw `You cannot use Clue on Variants without 25 lists of goals. The current variant set up in Settings contains ${listsA.length} lists.`;
        }
        // for each slot
        for (let i = 1; i <= 25; i++) {
            const slot = document.getElementById(`slot${i}`);
            let goal = '';
            let revealed = false;
            if (document.getElementById(`original_goal_${i}`)) {
                goal = document.getElementById(`original_goal_${i}`).innerText;
            }

            // Find goal text
            for (let iterator = 0; iterator < slot.children.length; iterator++) {
                if (slot.children[iterator].classList.contains("bg-color")) {
                    revealed = true;
                }
                if (goal === '' && slot.children[iterator].classList.contains("text-container")) {
                    goal = slot.children[iterator].innerText;
                }
            }

            if (goal === '') {
                console.log("DOM not fully loaded yet");
                return;
            }

            // If square is revealed, don't add the sheet
            if (revealed) {
                const sheet = document.getElementById(`sheet${i}`);
                if (sheet !== null) {
                    sheet.parentElement.removeChild(sheet);
                }
                continue;
            }
            // Create paper
            const id = `sheet${i}`;
            if (document.getElementById(id) !== null) {
                continue;
            }

            // Find correct list for that goal
            const currentList = listsA.find(l => l.some(el => el.name === goal))

            if (!currentList) {
                throw `Clue: Could not find list for Slot #${i}. Please verify that you are using the URL for this Game and Variant on the Settings page.`;
            }

            // populate progress object
            if (!progress[i - 1]) {
                progress[i - 1] = new Array(currentList.length)
            }

            const sheet = document.createElement("div");
            sheet.id = id
            sheet.className = 'my-paper';

            sheet.addEventListener("click", eventStopper);
            sheet.addEventListener("contextmenu", eventStopper);


            // push text node
            for (let j = 0; j < currentList.length; j++) {
                const displayedGoal = currentList[j].name;
                const leftClickFunction = displayedGoal === goal ? (e) => reveal(i, e) : (e) => cross(i, j, e);

                let fontSize = 32 / currentList.length;
                fontSize *= 20 / displayedGoal.length;
                fontSize = Math.min(fontSize, 8);
                fontSize = Math.max(fontSize, 4);
                fontSize = Math.floor(10 * fontSize) / 10;

                const row = document.createElement("div");
                row.id = `slot${i}_option${j}`;
                row.innerHTML = displayedGoal;
                if (progress[i - 1][j]) {
                    row.className += 'crossed';
                }
                row.style = `display: flex; align-items: center; justify-content: center; height: calc(100% / ${currentList.length}); font-size: ${fontSize}pt;`;

                row.addEventListener("click", leftClickFunction);
                row.addEventListener("contextmenu", (e) => cross(i, j, e));
                sheet.appendChild(row)
            }
            slot.appendChild(sheet);
            if (document.getElementsByClassName("board-cover")[0]) {
                document.getElementsByClassName("board-cover")[0].style.zIndex = '105';
            }
            translateSheet(sheet, translate ? listsA : listsB, translate ? listsB : listsA);
        }
    } catch (e) {
        // hide all sheets
        for (let i = 1; i <= 25; i++) {
            const sheet = document.getElementById(`sheet${i}`);
            if (sheet !== null) {
                sheet.parentElement.removeChild(sheet);
            }
        }

        // display error
        console.error(e);
    }
}

new MutationObserver(updateSheets).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

console.log("Clue module loaded.")

function applyConfig(config) {
    if(!config) {
        return;
    }

    if (config.clue !== enableClue) {
        const message = `${config.clue ? "I just enabled Clue!" : "I just disabled Clue!"} (nonce: ${Date.now()})`;
        if (document.getElementsByClassName("chat-input").length > 0) {
            document.getElementsByClassName("chat-input")[0].value = message;
            const sendMessageButton = document.getElementsByClassName("chat-send")[0];

            const evObj = document.createEvent('Events');
            evObj.initEvent('click', true, false);
            sendMessageButton.dispatchEvent(evObj);
        }
    }

    enableClue = config.clue;
    if (enableClue) {
        chrome.runtime.sendMessage({type: "request", content: 'listsA'}, updateSheets)
    } else {
        updateSheets();
    }}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        applyConfig(message.config);
    }
})

chrome.runtime.sendMessage({type: 'request', content: 'config'}, applyConfig)
