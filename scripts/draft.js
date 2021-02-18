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

function seekAndHide(color) {
    const found = [];
    for (let i = 1; i <= 25; i++) {
        let slot = document.getElementById(`slot${i}`);
        let colorChild = getElementChildByClassName(slot, `bg-color`);
        if (colorChild) {
            while (colorChild.className.includes("bg-color")) {
                if (colorChild.className.includes(`${color}square`)) {
                    found.push(i);
                    colorChild.style.display = 'none';
                } else {
                    colorChild.backupTransform = color.style;
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
                if(colorChild.backupTransform) {
                    colorChild.style = colorChild.backupTransform;
                } else {
                    colorChild.style = '';
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

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        handleConfigDraft(message.config);
    }
});

chrome.runtime.sendMessage({type: "request", content: 'config'}, handleConfigDraft)

console.log("Draft module loaded")
