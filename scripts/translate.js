console.log("Translate module loaded.");

let translate = false;

function translateGoal(goal, a, b) {
    if (typeof a[0] === typeof []) {
        let originalList, originalPosition;
        for (let list = 0; list < a.length; list++) {
            const index = a[list].findIndex(el => el.name === goal);
            if (index >= 0) {
                originalPosition = index;
                originalList = list;
                break;
            }
        }
        if (originalList > -1 && originalPosition > -1)
            return b[originalList][originalPosition].name;
    } else if (typeof a[0] === typeof '') {
        const originalPosition = a.findIndex(el => el === goal);
        if (originalPosition > -1)
            return b[originalPosition];
    }
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
        // Check if translation exists for that goal
        let translatedGoal = document.getElementById(`translated_goal_${i}`);
        if (!translatedGoal) {
            const slot = document.getElementById(`original_goal_${i}`);
            if (!slot) {
                return;
            }
            let goalText = slot.innerText;
            try {
                // Translate goal text
                let translatedText = translateGoal(goalText, listsA, listsB);
                if (translatedText !== undefined) {
                    let translated = document.createElement('div');
                    translated.className = 'vertical-center text-container';
                    translated.style = 'font-size: 100%';
                    translated.id = `translated_goal_${i}`;
                    translated.innerText = translatedText;
                    slot.parentElement.appendChild(translated);
                }
            } catch (e) {
            }
        }


        // Display original goal and hide translated
        const sheet = document.getElementById(`sheet${i}`);
        if (translate) {
            document.getElementById(`original_goal_${i}`).style.opacity = '0';
            document.getElementById(`translated_goal_${i}`).style.opacity = '1';

            // Clue
            translateSheet(sheet, listsA, listsB);

        } else {
            if (document.getElementById(`translated_goal_${i}`))
                document.getElementById(`translated_goal_${i}`).style.opacity = '0';
            if (document.getElementById(`original_goal_${i}`))
                document.getElementById(`original_goal_${i}`).style.opacity = '1';

            // Clue
            translateSheet(sheet, listsB, listsA);
        }
    }

// Chat
    for (const goalName of document.getElementsByClassName('goal-name')) {
        try {
            const translatedChat = translateGoal(goalName.innerText, translate ? listsA : listsB, translate ? listsB : listsA);
            if (translatedChat) {
                goalName.innerText = translatedChat
            }
        } catch (e) {
        }
    }
}

chrome.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        handleTranslationConfig(message.config);
    }
});

function handleTranslationConfig(config) {
    if (!config) {
        return;
    }
    if (translate !== config.translation) {
        translate = config.translation;
        if (listsA === []) {
            console.log("Main list is not defined");
            translate = false;
        } else if (listsB === []) {
            console.log("Secondary list is not defined");
            translate = false;
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
