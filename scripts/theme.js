const defaultTheme = {
    colors: {
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
        }
    },
    font: ''
};

function apply(theme) {
    try {
        let elem = document.getElementById(`custom_theme`);
        elem.parentNode.removeChild(elem);
    } catch (ignored) {
    }

    let css = '';
    for (const color in theme.colors) {
        css += `.${color}square {background-image: linear-gradient(${theme.colors[color]["top"]} 60%, ${theme.colors[color]["bottom"]}) !important;} `;
        css += `.${color} {border-color: ${theme.colors[color]["top"]} !important;} `;
        css += `.${color}player {color: ${theme.colors[color]["top"]} !important;} `;
    }

    const fontFamily = theme.font;
    if (fontFamily) {
        css += `body, h1, h2, h3, h4, h5, h6{font-family: ${fontFamily} !important;} `;
    }

    const sheet = document.createElement('style');
    sheet.setAttribute("id", "custom_theme");
    sheet.innerHTML = css;
    document.body.appendChild(sheet);
}

function updateTheme(theme) {
    if (theme === undefined) {
        apply(defaultTheme);
    } else {
        apply(theme)
    }
}

console.log("Theme module loaded.")
browser.runtime.onMessage.addListener(message => {
    if (message.type === 'config') {
        browser.runtime.sendMessage({type: "request", content: 'theme'}).then(updateTheme)
    } else if (message.type === 'theme') {
        updateTheme(message.theme);
    }
});

browser.runtime.sendMessage({type: "request", content: 'theme'}).then(updateTheme)
