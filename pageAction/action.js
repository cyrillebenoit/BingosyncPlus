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
            enabled: document.querySelector("#enable-invasion").checked,
            players: [{
                clickable: document.querySelector("#p1c").checked,
                mistake: document.querySelector("#p1m").checked
            }, {
                clickable: document.querySelector("#p2c").checked,
                mistake: document.querySelector("#p2m").checked
            }],
            swap: document.querySelector("#swap").checked,
        },
        draft: {
            enabled: document.querySelector("#enable-draft").checked,
            players: [{
                from: document.querySelector("#draft-from-1").value,
                to: document.querySelector("#draft-to-1").value,
            },{
                from: document.querySelector("#draft-from-2").value,
                to: document.querySelector("#draft-to-2").value,
            },]
        },
        rowControl: document.querySelector("#enable-row-control").checked,
        clue: document.querySelector("#enableClue").checked,
        ordering: (document.getElementById("orderingMode0").checked ? 0
            : document.getElementById("orderingMode1").checked ? 1 : 2), // 0 -> none, 1 -> sort, 2 -> transpose
        translation: document.querySelector("#enableTranslation").checked,
        theming: document.querySelector("#enableTheming").checked
    };

    console.log("saving " + JSON.stringify(config));
    localStorage.setItem(`${key}`, JSON.stringify(config));
    browser.runtime.sendMessage({
        type: 'config',
        config
    });
}

function restoreOptions() {
    let config = JSON.parse(localStorage.getItem(key));
    if (!config) {
        return;
    }
    let {invasion, translation, ordering, rowControl, clue, draft, theming} = config;
    document.querySelector("#enable-draft").checked = draft.enabled;
    document.querySelector("#enable-row-control").checked = rowControl;
    document.querySelector("#enable-invasion").checked = invasion.enabled;
    handleSettingsAction("invasion-settings", invasion.enabled);
    handleSettingsAction("draft-settings", draft.enabled);
    document.querySelector("#p1c").checked = invasion.players[0].clickable;
    document.querySelector("#p1m").checked = invasion.players[0].mistake;
    document.querySelector("#p2c").checked = invasion.players[1].clickable;
    document.querySelector("#p2m").checked = invasion.players[1].mistake;
    document.querySelector("#draft-from-1").value = draft.players[0].from;
    document.querySelector("#draft-to-1").value = draft.players[0].to;
    document.querySelector("#draft-from-2").value = draft.players[1].from;
    document.querySelector("#draft-to-2").value = draft.players[1].to;
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

    browser.runtime.sendMessage({
        type: 'config',
        config
    });
}

function openSettings() {
    browser.tabs.create({
        active: true,
        url: browser.runtime.getURL('/options/page.html')
    })
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelectorAll(".trigger").forEach(el => el.addEventListener("click", sendConfig));

function showTab(tab) {
    const tabs = ['format', 'ordering', 'theming', 'translation'];
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

function handleSettingsAction(name, state) {
    const settingsBlock = document.getElementById(name);
    const UNUSED = 'rgb(111, 111, 111)';
    settingsBlock.style.backgroundColor = state ? 'white' : UNUSED;
}

document.getElementById("enable-invasion").addEventListener("click", e => handleSettingsAction("invasion-settings", e.target.checked))
document.getElementById("enable-draft").addEventListener("click", e => handleSettingsAction("draft-settings", e.target.checked))
document.getElementById("theming_tab_button").addEventListener("click", () => showTab('theming'));
document.getElementById("ordering_tab_button").addEventListener("click", () => showTab('ordering'));
document.getElementById("translation_tab_button").addEventListener("click", () => showTab('translation'));
document.getElementById("format_tab_button").addEventListener("click", () => showTab('format'));

document.getElementById("settings1").addEventListener("click", openSettings)
document.getElementById("settings2").addEventListener("click", openSettings)
document.getElementById("settings3").addEventListener("click", openSettings)
document.getElementById("settings4").addEventListener("click", openSettings)
