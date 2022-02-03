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

const ON = 'rgb(215,255,237)';
const OFF = 'rgb(255,255,255)';

const formats = {
    invasion: false,
    draft: false,
    rc: false,
    clue: false,
    bdraft: false
}

function sendConfig() {
    const config = {
        invasion: {
            enabled: formats.invasion,
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
            enabled: formats.draft,
            players: [{
                from: document.querySelector("#draft-from-1").value,
                to: document.querySelector("#draft-to-1").value,
            }, {
                from: document.querySelector("#draft-from-2").value,
                to: document.querySelector("#draft-to-2").value,
            },]
        },
        rowControl: formats.rc,
        bdraft: formats.bdraft,
        clue: formats.clue,
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

function toggleSetting(id, name) {
    formats[name] = !formats[name];
    document.getElementById(id).style.backgroundColor = formats[name] ? ON : OFF;
    sendConfig();
    if (name === 'clue' && formats[name]) {
        document.getElementById("clue-warning").style.display = 'block';
        setTimeout(() => document.getElementById("clue-warning").style.display = 'none', 2000);
    }
}

function restoreOptions() {
    function setupBox(id, name, value) {
        document.getElementById(id).addEventListener("click", () => toggleSetting(id, name));
        document.getElementById(id).style.backgroundColor = value ? ON : OFF;
        formats[name] = value;
    }

    let config = JSON.parse(localStorage.getItem(key));
    if (!config) {
        setupBox("invasion-box", "invasion", false);
        setupBox("draft-box", "draft", false);
        setupBox("rc-box", "rc", false);
        setupBox("bdraft-box", "bdraft", false);
        setupBox("clue-box", "clue", false);

        return;
    }
    let {invasion, translation, ordering, rowControl, clue, draft, bdraft, theming} = config;

    setupBox("invasion-box", "invasion", invasion && invasion.enabled);
    setupBox("draft-box", "draft", draft && draft.enabled);
    setupBox("rc-box", "rc", rowControl);
    setupBox("bdraft-box", "bdraft", bdraft);
    setupBox("clue-box", "clue", clue);

    handleSettingsAction("invasion-settings", invasion && invasion.enabled);
    handleSettingsAction("draft-settings", draft && draft.enabled);
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

handleSettingsAction("invasion-settings", false);
handleSettingsAction("draft-settings", false);

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
    settingsBlock.style.height = state ? '100%' : '0';
    const UNUSED = 'rgb(111, 111, 111)';
    settingsBlock.style.backgroundColor = state ? 'white' : UNUSED;
}

document.getElementById("invasion-box").addEventListener("click", () => handleSettingsAction("invasion-settings", !formats.invasion))
document.getElementById("draft-box").addEventListener("click", () => handleSettingsAction("draft-settings", !formats.draft))
document.getElementById("theming_tab_button").addEventListener("click", () => showTab('theming'));
document.getElementById("ordering_tab_button").addEventListener("click", () => showTab('ordering'));
document.getElementById("translation_tab_button").addEventListener("click", () => showTab('translation'));
document.getElementById("format_tab_button").addEventListener("click", () => showTab('format'));

document.getElementById("settings1").addEventListener("click", openSettings)
document.getElementById("settings2").addEventListener("click", openSettings)
document.getElementById("settings3").addEventListener("click", openSettings)
