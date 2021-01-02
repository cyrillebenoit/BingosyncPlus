let listsA = [];
let listsB = [];

function labelCard() {
    for (let i = 1; i <= 25; i++) {
        if (!document.getElementById(`original_goal_${i}`)) {
            const slot = document.getElementById(`slot${i}`);
            for (const child of slot.childNodes) {
                if (child.className === 'vertical-center text-container') {
                    child.id = `original_goal_${i}`;
                    break;
                }
            }
        }
    }
}

function handleLists(body, target) {
    let evaluation = eval(body)
    if (!evaluation) {
        return;
    }
    evaluation = evaluation.slice(1);
    // check format of lists
    if (typeof evaluation !== typeof []) {
        // window.alert(`Invalid list ${target.toUpperCase()}: ${evaluation.toString()}`);
        return;
    }
    if (target === 'b') {
        if (evaluation.length !== listsA.length) {
            window.alert(`Secondary list has a different length as Main list`);
            return;
        }
        for (let i = 0; i < evaluation.length; i++) {
            if (typeof evaluation[i] !== typeof listsA[i]) {
                window.alert(`Secondary list has a type as Main list in position ${i}`);
                return;
            }
        }
    }
    if (target === 'a') {
        listsA = evaluation;
    } else {
        listsB = evaluation;
    }
    labelCard();
}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'listsA') {
        handleLists(message.lists, 'a')
    } else if (message.type === 'listsB') {
        handleLists(message.lists, 'b')
    }
});

chrome.runtime.sendMessage({type: 'request', content: 'listsA'}, lists => handleLists(lists, 'a'));
chrome.runtime.sendMessage({type: 'request', content: 'listsB'}, lists => handleLists(lists, 'b'));


new MutationObserver(labelCard).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

console.log("Loading module loaded.")
