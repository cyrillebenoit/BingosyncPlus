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
const key = 'bingosync+';

function sendConfig() {
    let config = {
        players: [{
            clickable: document.querySelector("#p1c").checked,
            mistake: document.querySelector("#p1m").checked
        }, {
            clickable: document.querySelector("#p2c").checked,
            mistake: document.querySelector("#p2m").checked
        }],
        swap: document.querySelector("#swap").checked
    };

    console.log("saving" + JSON.stringify(config));
    localStorage.setItem(`${key}`, JSON.stringify(config));

    /**
     * Get the active tab,
     * then send config.
     */
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "newconfig",
            config
        });
    });
}

function restoreOptions() {

    let config = JSON.parse(localStorage.getItem(key));
    if (config) {
        document.querySelector("#p1c").checked = config.players[0].clickable;
        document.querySelector("#p1m").checked = config.players[0].mistake;
        document.querySelector("#p2c").checked = config.players[1].clickable;
        document.querySelector("#p2m").checked = config.players[1].mistake;
        document.querySelector("#swap").checked = config.swap;
    }
    /**
     * Get the active tab,
     * then send config.
     */
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "newconfig",
            config
        });
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelectorAll(".trigger").forEach(el => el.addEventListener("click", sendConfig));

