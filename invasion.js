/**
 * Copyright (c) 2020
 *
 * This file reads the bingo card in real time and marks the clickable goals
 * for one or two of the players for the invasion variant (on bingosync.com)
 *
 * @summary Invasion Bingo Helper
 * @author Papaccino <papaccino@outlook.com>
 *
 * Created at     : 2020-06-11 00:00:00
 * Last modified  : 2020-06-12 20:09:00
 */

const EMPTY = '';
const TEMP_STARTING_LANES = ["TOP LEFT", "TOP RIGHT", "BOTTOM RIGHT", "BOTTOM LEFT"];
const STARTING_LANES = ["TOP", "RIGHT", "BOTTOM", "LEFT"];

let config = {
    players: [{
        clickable: false,
        mistake: false
    }, {
        clickable: false,
        mistake: false
    }],
    swap: false
};

function newCard() {
    return [
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
    ];
}

function rotateCard(card) {
    const copy = newCard();

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            copy[j][i] = card[4 - i][j];
        }
    }

    return copy;
}

function isDirectionValid(direction) {
    if (direction[0] === 0)
        return false;
    for (let i = 0; i < direction.length - 1; i++) {
        if (direction[i] < direction[i + 1]) {
            return false;
        }
    }
    return true;
}

function getStartingLane(card, colors) {
    let temporary_return = undefined;

    // for each color
    for (let color of colors) {
        // for each direction
        let directions = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]

        // check if number of goals per lane respects decreasing order
        // check how many goal are clicked on Row 1
        for (let lane = 0; lane < 5; lane++) {
            for (let i = 0; i < 5; i++) {
                if (card[lane][i] === color) {
                    directions[0][lane]++;
                }
                if (card[i][4 - lane] === color) {
                    directions[1][lane]++;
                }
                if (card[4 - lane][i] === color) {
                    directions[2][lane]++;
                }
                if (card[i][lane] === color) {
                    directions[3][lane]++;
                }
            }
        }

        // check unsure starting lanes
        if (isDirectionValid(directions[0]) && isDirectionValid(directions[1]) && isDirectionValid(directions[3]) ||
            isDirectionValid(directions[1]) && isDirectionValid(directions[2]) && isDirectionValid(directions[0]) ||
            isDirectionValid(directions[2]) && isDirectionValid(directions[3]) && isDirectionValid(directions[1]) ||
            isDirectionValid(directions[3]) && isDirectionValid(directions[0]) && isDirectionValid(directions[2])) {
            continue;
        }

        // is top valid
        if (isDirectionValid(directions[0])) {
            if (isDirectionValid(directions[1])) {
                if (temporary_return) {
                    switch (temporary_return.laneIndex) {
                        case 0:
                            return {
                                color: color,
                                lane: STARTING_LANES[1],
                                laneIndex: 1,
                                temporary: false
                            };
                        case 2:
                            return {
                                color: color,
                                lane: STARTING_LANES[0],
                                laneIndex: 0,
                                temporary: false
                            };
                    }
                }

                // top-right
                temporary_return = {
                    color: color,
                    lane: TEMP_STARTING_LANES[1],
                    laneIndex: 1,
                    temporary: true
                };
                continue;
            } else if (isDirectionValid(directions[3])) {
                if (temporary_return) {
                    switch (temporary_return.laneIndex) {
                        case 1:
                            return {
                                color: color,
                                lane: STARTING_LANES[3],
                                laneIndex: 3,
                                temporary: false
                            };
                        case 3:
                            return {
                                color: color,
                                lane: STARTING_LANES[0],
                                laneIndex: 0,
                                temporary: false
                            };
                    }
                }

                // top-left
                temporary_return = {
                    color: color,
                    lane: TEMP_STARTING_LANES[0],
                    laneIndex: 0,
                    temporary: true
                };
                continue;
            } else {
                // top
                return {
                    color: color,
                    lane: STARTING_LANES[0],
                    laneIndex: 0,
                    temporary: false
                }
            }
        }

        if (isDirectionValid(directions[2])) {
            if (isDirectionValid(directions[1])) {
                if (temporary_return) {
                    switch (temporary_return.laneIndex) {
                        case 1:
                            return {
                                color: color,
                                lane: STARTING_LANES[2],
                                laneIndex: 2,
                                temporary: false
                            };
                        case 3:
                            return {
                                color: color,
                                lane: STARTING_LANES[1],
                                laneIndex: 1,
                                temporary: false
                            };
                    }
                }

                // bottom-right
                temporary_return = {
                    color: color,
                    lane: TEMP_STARTING_LANES[2],
                    laneIndex: 2,
                    temporary: true
                };
                continue;
            } else if (isDirectionValid(directions[3])) {
                if (temporary_return) {
                    switch (temporary_return.laneIndex) {
                        case 0:
                            return {
                                color: color,
                                lane: STARTING_LANES[2],
                                laneIndex: 2,
                                temporary: false
                            };
                        case 2:
                            return {
                                color: color,
                                lane: STARTING_LANES[3],
                                laneIndex: 3,
                                temporary: false
                            };
                    }
                }

                // bottom-left
                temporary_return = {
                    color: color,
                    lane: TEMP_STARTING_LANES[3],
                    laneIndex: 3,
                    temporary: true
                };
                continue;
            } else {
                // bottom
                return {
                    color: color,
                    lane: STARTING_LANES[2],
                    laneIndex: 2,
                    temporary: false
                }
            }
        }

        if (isDirectionValid(directions[1])) {
            // right
            return {
                color: color,
                lane: STARTING_LANES[1],
                laneIndex: 1,
                temporary: false
            }
        } else if (isDirectionValid(directions[3])) {
            // left
            return {
                color: color,
                lane: STARTING_LANES[3],
                laneIndex: 3,
                temporary: false
            }
        }
    }
    return temporary_return;
}

function fillClickableGoals(card, clickableGoals, color) {
    let previousCount = 5;
    for (let row = 0; row < 5; row++) {
        // Count clicked goals on next row
        let count = 0;
        for (let i = 0; i < 5; i++) {
            if (card[row][i] === color) {
                count++
            }
        }

        // If count > previousClicked
        if (count > previousCount) {
            // There's a mistake. Add warning on all clicked goals on that lane
            for (let i = 0; i < 5; i++) {
                if (card[row][i] === color && clickableGoals[row][i] === EMPTY) {
                    clickableGoals[row][i] += `${color}-mistake `;
                }
            }
        }

        // If count < previousClicked
        if (count < previousCount) {
            // Set all unclicked goals as clickable on the lane
            for (let i = 0; i < 5; i++) {
                if (card[row][i] === EMPTY && !clickableGoals[row][i].includes(`${color} `)) {
                    clickableGoals[row][i] += `${color} `;
                }
            }
        }

        // Set up to that amount as clickable on the next lane
        previousCount = Math.min(previousCount, count);
        // Repeat until we reach the other side
    }
    return clickableGoals;
}

/**
 * From a bingo card and a list of colors, returns the list of clickable goals per color
 * @param card
 * @param colors
 * @return bingoCard copy with clickables colors
 */
function checkClickableGoals(card, colors) {
    let clickableGoals = newCard();

    if (startingLanes === undefined) {
        for (let color of colors) {
            let copy = card;
            for (let i = 0; i < 4; i++) {
                copy = rotateCard(copy);
                clickableGoals = rotateCard(clickableGoals);
                clickableGoals = fillClickableGoals(copy, clickableGoals, color);
            }
        }
    } else {
        // Define Clickable Goals for each color
        for (const color of colors) {
            // Get that color's starting lane
            let startingLane = startingLanes[0].color === color ? startingLanes[0].lane : startingLanes[1].lane;

            let copy = card;

            if (STARTING_LANES.includes(startingLane)) {
                // Rotate copy so TOP is the starting lane
                for (let i = 0; i < 4 - STARTING_LANES.indexOf(startingLane); i++) {
                    copy = rotateCard(copy);
                    clickableGoals = rotateCard(clickableGoals);
                }

                clickableGoals = fillClickableGoals(copy, clickableGoals, color);

                // Unrotate clickables
                for (let i = 0; i < STARTING_LANES.indexOf(startingLane); i++) {
                    clickableGoals = rotateCard(clickableGoals);
                }
            } else {
                // Rotate copy so TOP-LEFT is the starting lane
                for (let i = 0; i < 4 - TEMP_STARTING_LANES.indexOf(startingLane); i++) {
                    copy = rotateCard(copy);
                    clickableGoals = rotateCard(clickableGoals);
                }
                clickableGoals = fillClickableGoals(copy, clickableGoals, color);

                // Rotate once so TOP-RIGHT is the starting lane
                copy = rotateCard(copy);
                clickableGoals = rotateCard(clickableGoals);

                clickableGoals = fillClickableGoals(copy, clickableGoals, color);

                // Unrotate clickables
                for (let i = 0; i < 3 + TEMP_STARTING_LANES.indexOf(startingLane); i++) {
                    clickableGoals = rotateCard(clickableGoals)
                }
            }
        }
    }

    for (let node of addedNodes) {
        let elem = document.getElementById(node);
        elem.parentNode.removeChild(elem);
    }
    addedNodes = [];

    // Display Clickable Goals on Card
    for (let i = 0; i < 25; i++) {
        let slot = document.getElementById(`slot${i + 1}`);
        let clickable = clickableGoals[Math.floor(i / 5)][i % 5];
        if (clickable !== EMPTY) {
            let newClasses = clickable.trim().split(" ");
            let newContainer = document.createElement("div");
            newContainer.setAttribute("class", "circle-container");
            newContainer.setAttribute("id", `slot${i + 1}_highlight`);
            addedNodes.push(`slot${i + 1}_highlight`);

            for (let className of newClasses) {
                let newChild = document.createElement("div");
                let mistake = false;
                if (className.includes("mistake")) {
                    className = className.substr(0, className.indexOf("-mistake"));
                    mistake = true;
                }
                const corner = colors.indexOf(className) === 0 ? "first" : "second";

                let right = colors.indexOf(className) === 1;

                if (right && newClasses.length < 2) {
                    newContainer.appendChild(document.createElement("div"));
                }

                newChild.setAttribute("class", `${mistake ?
                    (config.players[right ? 1 : 0].mistake ? "mistake" : "") :
                    (config.players[right ? 1 : 0].clickable ? "circle" : "")} ${className} ${corner}`);
                // Create new Element with class
                newContainer.appendChild(newChild);
            }
            slot.insertBefore(newContainer, slot.childNodes[slot.childElementCount - 1]);
        }
    }
}

function isCardEmpty(card) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (card[i][j] !== EMPTY) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Fetch in HTML colors of the first 2 players on a card
 * @return {[]}
 */
function getPlayerColors() {
    const colors = [];
    for (let i = 0; i < 2; i++) {
        const player_element = document.getElementById("players-panel").children.item(config.swap ? 1 - i : i);
        let colorClass = player_element.children.item(0).classList[1];
        colors.push(colorClass.substring(0, colorClass.indexOf("square")));
    }
    return colors;
}

function checkBoard() {
    for (let i = 1; i < 26; i++) {
        const goalColor = document.getElementById("slot" + i).getAttribute("title");

        let row = Math.floor((i - 1) / 5);
        let col = (i - 1) % 5;
        bingoCard[row][col] = goalColor;
    }

    // At this point, whenever someone connects, disconnects, or clicks a goals
    // The logical state of the board will update with the color of each goal
    if (isCardEmpty(bingoCard)) {
        startingLanes = undefined;
    }

    let colors = getPlayerColors();

    // From Logical State define "Starting Lanes"
    if (startingLanes === undefined || TEMP_STARTING_LANES.includes(startingLanes[0].lane)) {
        const lane = getStartingLane(bingoCard, colors);
        console.log(lane);
        if (lane) {
            let oppositeColor = colors[0] === lane.color ? colors[1] : colors[0];
            let oppositeLane = lane.temporary ?
                TEMP_STARTING_LANES[(lane.laneIndex + 2) % 4] : STARTING_LANES[(lane.laneIndex + 2) % 4];

            if (startingLanes && TEMP_STARTING_LANES.includes(startingLanes[0].lane) && lane.temporary) {
                // Check former lane for that color
                let formerLane = lane.color === startingLanes[0].color ? startingLanes[0].lane : startingLanes[1].lane;

                // Check if we walked across the edge
                if (formerLane !== lane) {
                    if (TEMP_STARTING_LANES.indexOf(formerLane) === 0 && lane.laneIndex === 1 ||
                        TEMP_STARTING_LANES.indexOf(formerLane) === 1 && lane.laneIndex === 0) {
                        console.log("TOP DETECTED")
                        lane.lane = STARTING_LANES[0];
                        oppositeLane = STARTING_LANES[2];
                    }

                    if (TEMP_STARTING_LANES.indexOf(formerLane) === 1 && lane.laneIndex === 2 ||
                        TEMP_STARTING_LANES.indexOf(formerLane) === 2 && lane.laneIndex === 1) {
                        console.log("RIGHT DETECTED")
                        lane.lane = STARTING_LANES[1];
                        oppositeLane = STARTING_LANES[3];
                    }

                    if (TEMP_STARTING_LANES.indexOf(formerLane) === 2 && lane.laneIndex === 3 ||
                        TEMP_STARTING_LANES.indexOf(formerLane) === 3 && lane.laneIndex === 2) {
                        console.log("BOTTOM DETECTED")
                        lane.lane = STARTING_LANES[2];
                        oppositeLane = STARTING_LANES[0];

                    }

                    if (TEMP_STARTING_LANES.indexOf(formerLane) === 3 && lane.laneIndex === 0 ||
                        TEMP_STARTING_LANES.indexOf(formerLane) === 0 && lane.laneIndex === 3) {
                        console.log("LEFT DETECTED")
                        lane.lane = STARTING_LANES[3];
                        oppositeLane = STARTING_LANES[1];

                    }
                }
            }

            startingLanes = [{
                color: lane.color,
                lane: lane.lane
            }, {
                color: oppositeColor,
                lane: oppositeLane
            }];
        }
    }

    checkClickableGoals(bingoCard, getPlayerColors());
}

let chat_element = document.getElementById("bingo-chat");

let startingLanes;
let addedNodes = [];
let bingoCard = newCard();


const observer = new MutationObserver(checkBoard)
observer.observe(chat_element, {
    attributes: true,
    childList: true,
    subtree: true
})

/**
 * Listen for messages from the background script.
 * Updates the config object. And reruns
 */
browser.runtime.onMessage.addListener((message) => {
    if (message.command === "newconfig") {
        config = message.config;
        checkBoard();
    }
});

