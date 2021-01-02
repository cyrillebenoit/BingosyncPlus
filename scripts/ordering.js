let orderingMode = 0;

function arrangeCard(currentSort) {
    // for each row
    for (let i = 0; i < 5; i++) {
        let row = document.getElementById(`row${i + 1}`).parentElement;
        for (let j = 0; j < 5; j++) {
            const currentList = i * 5 + j;
            const element = document.getElementById(currentSort[currentList]);
            row.appendChild(element);
        }
    }
}

function sortCard() {
    let currentSort = new Array(25);
    try {
        // for each row
        for (let i = 0; i < 5; i++) {
            let slot = document.getElementById(`row${i + 1}`);

            if (!slot) {
                return;
            }

            // for each slot
            for (let j = 0; j < 5; j++) {
                slot = slot.nextElementSibling;
                let goal = '';
                // Find goal text
                let slotNumber = slot.id.substr(4);
                goal = document.getElementById(`original_goal_${slotNumber}`);

                if (!goal) {
                    return;
                }

                goal = goal.innerText;

                // Find correct list for that goal
                const currentList = listsA.findIndex(l => l.some(el => el.name === goal));

                if (currentList < 0) {
                    throw `Sorting goals: Could not find list for Slot #${slotNumber}. Please verify that you are using the URL for this Game and Variant on the Settings page.`;
                }

                // console.log('slot', (i * 5) + j + 1, 'list', currentList + 1)
                currentSort[currentList] = slot.id;
            }
        }
    } catch (e) {
        // window.alert(e);
        currentSort = [
            'slot1', 'slot2', 'slot3', 'slot4', 'slot5',
            'slot6', 'slot7', 'slot8', 'slot9', 'slot10',
            'slot11', 'slot12', 'slot13', 'slot14', 'slot15',
            'slot16', 'slot17', 'slot18', 'slot19', 'slot20',
            'slot21', 'slot22', 'slot23', 'slot24', 'slot25',
        ];
    } finally {
        arrangeCard(currentSort);
    }


}

function reorderCard() {
    switch (orderingMode) {
        case 2:
            arrangeCard([
                'slot1', 'slot6', 'slot11', 'slot16', 'slot21',
                'slot2', 'slot7', 'slot12', 'slot17', 'slot22',
                'slot3', 'slot8', 'slot13', 'slot18', 'slot23',
                'slot4', 'slot9', 'slot14', 'slot19', 'slot24',
                'slot5', 'slot10', 'slot15', 'slot20', 'slot25',
            ]);
            break;
        case 1:
            sortCard();
            break;
        case 0:
        default:
            arrangeCard([
                'slot1', 'slot2', 'slot3', 'slot4', 'slot5',
                'slot6', 'slot7', 'slot8', 'slot9', 'slot10',
                'slot11', 'slot12', 'slot13', 'slot14', 'slot15',
                'slot16', 'slot17', 'slot18', 'slot19', 'slot20',
                'slot21', 'slot22', 'slot23', 'slot24', 'slot25',
            ]);
            break;
    }
}


new MutationObserver(reorderCard).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
})

browser.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        orderingMode = message.config.ordering;
        reorderCard();
    }
});


chrome.runtime.sendMessage({type: "request", content: 'config'}, config => {
    if (!config) {
        return;
    }
    orderingMode = config.ordering;
    reorderCard()
});

console.log("Ordering module loaded.")
