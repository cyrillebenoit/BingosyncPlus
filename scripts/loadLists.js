let listsA = [];
let listsB = [];
let coherent = false;

function areListsCoherent() {
    // if A and B are arrays
    if (Array.isArray(listsA) && Array.isArray(listsB)) {
        // check length
        if (listsA.length === 0) {
            console.error("Main List is empty");
            return false;
        }
        // check length
        if (listsA.length !== listsB.length) {
            console.error("Lists lengths are not the same");
            return false;
        }

        // for each element of the list, if an object
        for (let i = 0; i < listsA.length; i++) {
            if (!Array.isArray(listsA[i]) || !Array.isArray(listsB[i])) {
                console.error("Only SRL-style goal lists are supported for translation");
                return false;
            }
            if (listsA[i].length !== listsB[i].length) {
                console.error(`Check goal list format (error noticed for list ${i + 1})`);
                return false;
            }
        }
        return true;
    }
    console.error("Lists are not arrays");
    return false;
}

function labelCard() {
    // label slots
    for (let i = 1; i <= 25; i++) {
        const slot = document.getElementById(`slot${i}`);

        // Create Original goal tag
        if (!document.getElementById(`original_goal_${i}`)) {
            for (const child of slot.childNodes) {
                if (child.className === 'vertical-center text-container') {
                    child.id = `original_goal_${i}`;
                    child.style.zIndex = '0';
                    break;
                }
            }
        }

        // Create Translated goal tag
        const translatedGoal = document.getElementById(`translated_goal_${i}`);
        if (coherent && (!translatedGoal || !translatedGoal.innerText)) {
            try {
                // Translate goal text
                const translatedText = translateGoal(document.getElementById(`original_goal_${i}`).innerText, listsA, listsB);
                if (!translatedGoal) {
                    let translated = document.createElement('div');
                    translated.className = 'vertical-center text-container';
                    translated.style = 'font-size: 100%';
                    translated.id = `translated_goal_${i}`;
                    translated.style.zIndex = '0';
                    translated.style.opacity = '0';
                    translated.innerText = translatedText;
                    slot.appendChild(translated);
                    console.log(`Added translated text for slot ${i}`);
                } else {
                    translatedGoal.innerText = translatedText;
                    console.log(`Updated translated text for slot ${i}`);
                }
            } catch (e) {
                console.error(`Could not translate for slot ${i}`)
            }
        }
    }

    // label chat
    for (const goalName of document.getElementsByClassName('goal-name')) {
        if(goalName.childNodes.length > 1) {
            continue;
        }

        // create original tag
        const original = document.createElement("div");
        original.id = "original-chat-goal";
        original.style.display = 'inline';
        original.innerText = goalName.innerText;

        // create translated tag
        const translated = document.createElement("div");
        translated.id = "translated-chat-goal";
        translated.style.display = 'none';
        translated.innerText = translateGoal(original.innerText, listsA, listsB);

        goalName.innerText = '';
        goalName.appendChild(original);
        goalName.appendChild(translated);
    }
}

function handleLists(body, target) {
    let evaluation = eval(body)
    if (!evaluation) {
        return;
    }
    for (let i = 1; i <= 25; i++) {
        const translatedGoal = document.getElementById(`translated_goal_${i}`);
        if (translatedGoal) {
            translatedGoal.parentElement.removeChild(translatedGoal)
        }
    }
    evaluation = evaluation.slice(1);
    if (target === 'a') {
        listsA = evaluation;
        coherent = areListsCoherent();
    } else {
        listsB = evaluation;
        coherent = areListsCoherent();
    }
}

browser.runtime.onMessage.addListener(message => {
    if (message.type === 'listsA') {
        handleLists(message.lists, 'a')
    } else if (message.type === 'listsB') {
        handleLists(message.lists, 'b')
    }
});

browser.runtime.sendMessage({type: 'request', content: 'listsA'}).then(lists => handleLists(lists, 'a'));
browser.runtime.sendMessage({type: 'request', content: 'listsB'}).then(lists => handleLists(lists, 'b'));


new MutationObserver(labelCard).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

console.log("Loading module loaded.")
