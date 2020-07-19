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
const theme_key = "bsp_theme";


const defaultTheme = {
    orange: {
        top: '#F98E1E',
        bottom: '#D0800F'
    },
    red: {
        top: '#DA4440',
        bottom: '#CE302C'
    },
    blue: {
        top: '#37A1DE',
        bottom: '#088CBD'
    },
    green: {
        top: '#00B500',
        bottom: '#20A00A'
    },
    purple: {
        top: '#822dbf',
        bottom: '#7120ab'
    },
    navy: {
        top: '#0d48b5',
        bottom: '#022b75'
    },
    teal: {
        top: '#419695',
        bottom: '#2e7372'
    },
    brown: {
        top: '#ab5c23',
        bottom: '#6d3811'
    },
    pink: {
        top: '#ed86aa',
        bottom: '#cc6e8f'
    },
    yellow: {
        top: '#d8d014',
        bottom: '#c1ba0b'
    },
};


function sendConfig() {
    let config = {
        players: [{
            clickable: document.querySelector("#p1c").checked,
            mistake: document.querySelector("#p1m").checked
        }, {
            clickable: document.querySelector("#p2c").checked,
            mistake: document.querySelector("#p2m").checked
        }],
        swap: document.querySelector("#swap").checked,
        enableTheming: document.querySelector("#enableTheming").checked
    };

    updateTheme(config.enableTheming);

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

function updateTheme(custom) {
    const customTheme = localStorage.getItem(theme_key);
    if (custom && customTheme) {
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then(tabs => {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "newtheme",
                theme: JSON.parse(customTheme)
            });
        });
    } else {
        browser.tabs.query({
            active: true,
            currentWindow: true
        }).then(tabs => {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "newtheme",
                theme: defaultTheme
            });
        });
    }
}

function restoreOptions() {
    let config = JSON.parse(localStorage.getItem(key));
    if (config) {
        document.querySelector("#p1c").checked = config.players[0].clickable;
        document.querySelector("#p1m").checked = config.players[0].mistake;
        document.querySelector("#p2c").checked = config.players[1].clickable;
        document.querySelector("#p2m").checked = config.players[1].mistake;
        document.querySelector("#swap").checked = config.swap;
        document.querySelector("#enableTheming").checked = config.enableTheming;
    }

    updateTheme(config.enableTheming);

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

function openSettings() {
    browser.tabs.create({
        active: true,
        url: browser.runtime.getURL('/options/page.html')
    })
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelectorAll(".trigger").forEach(el => el.addEventListener("click", sendConfig));

document.getElementById("theming_tab_button").addEventListener("click", () => {
    // Hide other tabs
    document.getElementById("invasion").style = "display:none";

    // Show Theming tab
    document.getElementById("theming").style = "display:inline";
});

document.getElementById("invasion_tab_button").addEventListener("click", () => {
    // Hide other tabs
    document.getElementById("theming").style = "display:none";

    // Show Theming tab
    document.getElementById("invasion").style = "display:inline";
});

document.getElementById("settings").addEventListener("click", openSettings)
