let enableRC = false;

function checkRows() {
    const colors = getPlayerColors();

    const scores = [0, 0]

    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        let row = [];
        for (let slotIndex = rowIndex * 5 + 1; slotIndex <= (rowIndex + 1) * 5; slotIndex++) {
            row.push(document.getElementById(`slot${slotIndex}`));
        }

        // check if row is controlled
        let countP1inRow = 0;
        let countP2inRow = 0;
        for (const slot of row) {
            slot.rclocked = '0';
            slot.style.color = 'rgba(255,255,255,1)';
            if (getElementChildByClassName(slot, `${colors[0]}square`)) {
                countP1inRow++;
            }
            if (getElementChildByClassName(slot, `${colors[1]}square`)) {
                countP2inRow++;
            }
        }
        if (countP1inRow >= 3) {
            scores[0]++;
            if (enableRC) {
                for (const slot of row) {
                    if (!slot.title) {
                        slot.rclocked = '1';
                        slot.style.color = 'rgba(255,255,255,0.4)';
                    }
                }
            }
        }
        if (countP2inRow >= 3) {
            scores[1]++;
            if (enableRC) {
                for (const slot of row) {
                    if (!slot.title) {
                        slot.rclocked = '1';
                        slot.style.color = 'rgba(255,255,255,0.4)';
                    }
                }
            }
        }
    }

    setScore(colors[0], scores[0]);
    setScore(colors[1], scores[1]);
}

function setScore(color, score) {
    const panel = document.getElementById("players-panel");
    for (let playerIndex = 0; playerIndex < panel.childElementCount; playerIndex++) {
        const player = panel.children[playerIndex];
        const child = player.firstElementChild;
        if (child.className.includes(`${color}square`)) {
            let playerRCScore = getElementChildByClassName(child, 'bsp_rowcounter');
            if (!playerRCScore) {
                let playerRCScore = document.createElement("div");
                playerRCScore.className = 'bsp_rowcounter';
                child.appendChild(playerRCScore);
            }
            playerRCScore.innerText = score;

            if (enableRC) {
                getElementChildByClassName(child, 'squarecounter').style.display = 'none';
                getElementChildByClassName(child, 'bsp_rowcounter').style.display = 'inline';
            } else {
                getElementChildByClassName(child, 'squarecounter').style.display = 'inline';
                getElementChildByClassName(child, 'bsp_rowcounter').style.display = 'none';

            }
        }
    }
}

new MutationObserver(checkRows).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

function handleRCconfig(config) {
    enableRC = config.rowControl;
    checkRows();
}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        handleRCconfig(message.config);
    }
});

chrome.runtime.sendMessage({type: "request", content: 'config'}, handleRCconfig)

console.log("Draft module loaded")
