let draft = {
    enabled: false,
    players: [{
        from: 'orange',
        to: 'orange'
    }, {
        from: 'orange',
        to: 'orange'
    }]
};

const backupStyles = new Array(25);

function saveStyle(slot, color, style) {
    if (!backupStyles[slot]) {
        backupStyles[slot] = {};
    }
    backupStyles[slot][color] = style.transform;
}

function seekAndHide(color) {
    const found = [];
    for (let i = 1; i <= 25; i++) {
        let slot = document.getElementById(`slot${i}`);
        let colorChild = getElementChildByClassName(slot, `bg-color`);
        if (colorChild) {
            while (colorChild.className.includes("bg-color")) {
                const squareColor = colorChild.className.substring(colorChild.className.indexOf(" ") + 1, colorChild.className.indexOf("square"));
                if (colorChild.style.transform !== '' && colorChild.style.display !== 'none') {
                    saveStyle(i - 1, squareColor, colorChild.style);
                }
                if (colorChild.className.includes(`${color}square`)) {
                    found.push(i);
                    colorChild.style.display = 'none';
                } else {
                    colorChild.style.transform = '';
                }
                colorChild = colorChild.nextElementSibling;
            }
        }
    }
    return found;
}

function updateDraft() {
    for (let i = 1; i < 25; i++) {
        const slot = document.getElementById(`slot${i}`);
        let colorChild = getElementChildByClassName(slot, "bg-color");
        if (colorChild) {
            while (colorChild.className.includes('bg-color')) {
                const color = colorChild.className.substring(colorChild.className.indexOf(" ") + 1, colorChild.className.indexOf("square"));
                colorChild.style.display = 'block';
                if (backupStyles[i - 1] && backupStyles[i - 1][color]) {
                    colorChild.style.transform = backupStyles[i - 1][color];
                    delete backupStyles[i - 1][color];
                }
                colorChild = colorChild.nextElementSibling;
            }
        }
        const draftIndicator = document.getElementById(`draft_${i}`);
        if (draftIndicator) {
            draftIndicator.parentElement.removeChild(draftIndicator);
        }
    }

    if (draft.enabled) {
        const p1 = seekAndHide(draft.players[0].from);
        const p2 = seekAndHide(draft.players[1].from);

        const players = draft.players.map(p => p.to);

        for (const draft of p1) {
            const slot = document.getElementById(`slot${draft}`);
            const draftIndicator = document.createElement("div");
            draftIndicator.className = `${players[0]}draft draft`;
            draftIndicator.id = `draft_${draft}`;

            const previousElement = document.getElementById(draftIndicator.id);
            if (previousElement) {
                previousElement.className = draftIndicator.className;
            } else {
                slot.insertBefore(draftIndicator, getElementChildByClassName(slot, "text-container"));
            }
        }

        for (const draft of p2) {
            const slot = document.getElementById(`slot${draft}`);
            const draftIndicator = document.createElement("div");
            draftIndicator.className = `${players[1]}draft draft`;
            draftIndicator.id = `draft_${draft}`;

            const previousElement = document.getElementById(draftIndicator.id);
            if (previousElement) {
                previousElement.className = draftIndicator.className;
            } else {
                slot.insertBefore(draftIndicator, getElementChildByClassName(slot, "text-container"));
            }
        }
    }
}

new MutationObserver(updateDraft).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

function handleConfigDraft(config) {
    draft = config.draft;
    updateDraft();
}

browser.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        handleConfigDraft(message.config);
    }
});

browser.runtime.sendMessage({type: "request", content: 'config'}).then(handleConfigDraft)

console.log("Draft module loaded")
