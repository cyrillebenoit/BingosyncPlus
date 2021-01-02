/**
 * Copyright (c) 2020
 *
 * Browser Action JS
 *
 * @summary Invasion Bingo Helper
 * @author Papaccino <papaccino@outlook.com>
 *
 * Created at     : 2020-06-11 00:00:00
 * Last modified  : 2020-06-12 20:09:00
 */
const key = 'bsp_settings';

function sendConfig() {
    const config = {
        invasion: {
            players: [{
                clickable: document.querySelector("#p1c").checked,
                mistake: document.querySelector("#p1m").checked
            }, {
                clickable: document.querySelector("#p2c").checked,
                mistake: document.querySelector("#p2m").checked
            }],
            swap: document.querySelector("#swap").checked,
        },
        clue: document.querySelector("#enableClue").checked,
        ordering: (document.getElementById("orderingMode0").checked ? 0
            : document.getElementById("orderingMode1").checked ? 1 : 2), // 0 -> none, 1 -> sort, 2 -> transpose
        translation: document.querySelector("#enableTranslation").checked,
        theming: document.querySelector("#enableTheming").checked
    };

    console.log("saving " + JSON.stringify(config));
    localStorage.setItem(`${key}`, JSON.stringify(config));
    chrome.runtime.sendMessage({
        type: 'config',
        config
    });
}

function restoreOptions() {
    let config = JSON.parse(localStorage.getItem(key));
    if (!config) {
        return;
    }
    let {invasion, translation, ordering, clue, theming} = config;
    document.querySelector("#p1c").checked = invasion.players[0].clickable;
    document.querySelector("#p1m").checked = invasion.players[0].mistake;
    document.querySelector("#p2c").checked = invasion.players[1].clickable;
    document.querySelector("#p2m").checked = invasion.players[1].mistake;
    document.querySelector("#swap").checked = invasion.swap;
    document.querySelector("#enableTheming").checked = theming;

    if (ordering === 0) {
        document.getElementById('orderingMode0').checked = true;
        document.getElementById("orderingMode1").checked = false;
        document.getElementById("orderingMode2").checked = false;
    } else if (ordering === 1) {
        document.getElementById("orderingMode0").checked = false;
        document.getElementById("orderingMode1").checked = true;
        document.getElementById("orderingMode2").checked = false;
    } else {
        document.getElementById("orderingMode0").checked = false;
        document.getElementById("orderingMode1").checked = false;
        document.getElementById("orderingMode2").checked = true;
    }
    document.querySelector("#enableTranslation").checked = translation;
    document.querySelector("#enableClue").checked = clue;

    chrome.runtime.sendMessage({
        type: 'config',
        config
    });
}

function openSettings() {
    chrome.tabs.create({
        active: true,
        url: chrome.runtime.getURL('/options/page.html')
    })
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelectorAll(".trigger").forEach(el => el.addEventListener("click", sendConfig));

function showTab(tab) {
    const tabs = ['invasion', 'clue', 'ordering', 'theming', 'translation'];
    let toHide = tabs.filter(el => el !== tab);

    // Hide other tabs
    for (const hide of toHide) {
        document.getElementById(hide).style = "display:none";
        document.getElementById(`${hide}_tab_button`).className = 'inactive';
    }

    // Show current tab
    document.getElementById(tab).style = "display:inline";
    document.getElementById(`${tab}_tab_button`).className = 'active';
}

document.getElementById("theming_tab_button").addEventListener("click", () => showTab('theming'));
document.getElementById("ordering_tab_button").addEventListener("click", () => showTab('ordering'));
document.getElementById("translation_tab_button").addEventListener("click", () => showTab('translation'));
document.getElementById("invasion_tab_button").addEventListener("click", () => showTab('invasion'));
document.getElementById("clue_tab_button").addEventListener("click", () => showTab('clue'));

document.getElementById("settings1").addEventListener("click", openSettings)
document.getElementById("settings2").addEventListener("click", openSettings)
document.getElementById("settings3").addEventListener("click", openSettings)
document.getElementById("settings4").addEventListener("click", openSettings)
