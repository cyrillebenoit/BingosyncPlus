console.log("Translate module loaded.");

let translate = false;

function translateGoal(goal, from, to) {
    if (!coherent) {
        throw 'not coherent';
    }
    // SRL-style list
    if (typeof from[0] === "object") {
        const indexInLists = from.findIndex(list => list.some(el => el.name === goal));
        if (indexInLists > -1) {
            const indexInList = from[indexInLists].findIndex(el => el.name === goal);
            if (indexInList > -1) {
                return to[indexInLists][indexInList].name;
            }
        } else {
            // element not in list
        }
    }
    // else if (typeof from[0] === typeof '') {
    //     const originalPosition = from.findIndex(el => el === goal);
    //     if (originalPosition > -1 && to[originalPosition])
    //         return to[originalPosition];
    // }
    throw '';
}

function translateSheet(sheet, a, b) {
    if (sheet) {
        for (const option of sheet.childNodes) {
            try {
                const displayedGoal = translateGoal(option.innerText, a, b);
                const length = a.find(list => list.some(el => el.name === option.innerText)).length;
                let fontSize = 32 / length;
                fontSize *= 20 / displayedGoal.length;
                fontSize = Math.min(fontSize, 6);
                fontSize = Math.max(fontSize, 4);
                fontSize = Math.floor(10 * fontSize) / 10;
                option.innerText = displayedGoal;
                option.style.fontSize = `${fontSize}pt`;
            } catch (ignored) {
            }
        }
    }
}

function translateCard() {
    for (let i = 1; i <= 25; i++) {
        if (!coherent) {
            const original = document.getElementById(`original_goal_${i}`);
            original.style.opacity = '1';
            const translated = document.getElementById(`translated_goal_${i}`);
            if (translated) {
                translated.style.opacity = '0';
            }
            continue;
        }
        // Display original goal and hide translated
        const sheet = document.getElementById(`sheet${i}`);
        const original = document.getElementById(`original_goal_${i}`);
        const translated = document.getElementById(`translated_goal_${i}`);
        if (translate) {
            if (original)
                original.style.opacity = '0';
            if (translated)
                translated.style.opacity = '1';

            // Clue
            translateSheet(sheet, listsA, listsB);
        } else {
            if (translated)
                translated.style.opacity = '0';
            if (original)
                original.style.opacity = '1';

            // Clue
            translateSheet(sheet, listsB, listsA);
        }

        for(const goalName of document.getElementsByClassName("goal-name")) {
            goalName.children[0].style.display = translate ? 'none' : 'inline';
            goalName.children[1].style.display = translate ? 'inline' : 'none';
        }
    }
}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        handleTranslationConfig(message.config);
    }
});

function handleTranslationConfig(config) {
    if (config && translate !== config.translation) {
        translate = config.translation;
        if (listsA === []) {
            console.debug("Warning: Main list is not defined");
        } else if (listsB === []) {
            console.debug("Warning: Secondary list is not defined");
        }
    }
    translateCard();
}

chrome.runtime.sendMessage({type: "request", content: 'config'}, handleTranslationConfig)


new MutationObserver(translateCard).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})
