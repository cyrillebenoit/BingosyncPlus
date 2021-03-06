console.log("Blind Draft module loaded.")

let bdraft = false;

function setupBDraft() {
    for (let i = 1; i <= 25; i++) {
        const originalGoal = document.getElementById(`original_goal_${i}`);
        const translatedGoal = document.getElementById(`translated_goal_${i}`);
        if (originalGoal) {
            originalGoal.style.zIndex = bdraft ? '-1' : '0';
        }
        if (translatedGoal) {
            translatedGoal.style.zIndex = bdraft ? '-1' : '0';
        }
    }
}


function applyBDraftConfig(config) {
    bdraft = config.bdraft;
    setupBDraft();
}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        applyBDraftConfig(message.config);
    }
})

chrome.runtime.sendMessage({type: 'request', content: 'config'}, applyBDraftConfig);

new MutationObserver(setupBDraft).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
});
