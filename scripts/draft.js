function updateDraft() {
    const p1 = [1, 4, 5, 12, 21];
    const p2 = [3, 14, 17, 23, 24];

    const players = getPlayerColors();

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

new MutationObserver(updateDraft).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

console.log("Draft module loaded")
