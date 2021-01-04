console.log("Board functions module loaded.")

const bspScreenshotImageId = 'bsp-screenshot-image';

function dumpBoardToClipboard() {
    const tableToDump = document.getElementById('bingo');
    domtoimage.toPng(tableToDump).then(url => {
        document.getElementById(bspScreenshotImageId).src = url;
    }).catch(console.error);
}

function toggleView() {
    const bspSettings = document.getElementById("bingosync-plus-settings");
    for (const child of bspSettings.children) {
        if (child.className === 'panel-body') {
            child.style.display = child.style.display === 'none' ? 'block' : 'none';
            return;
        }
    }
}

function ensureBingosyncPlusSettingsBox() {
    let buttonBox = document.getElementById('bingosync-plus-settings-box');
    if (!buttonBox) {
        // This is very cursed.
        // Since there's no ID and no classnames sometimes, we have to navigate this way.
        let settingsContainer = document.getElementById('room-settings-container').parentElement;
        let snippet = document.createElement('template');
        snippet.innerHTML = `<div class="flex-col-footer">
        <div id="bingosync-plus-settings" class="panel panel-default fill-parent">
        <div class="panel-heading">
        <span>
        Bingosync +
        </span>
        <span id="bingosync-plus-settings-collapse" class="btn btn-default btn-xs pull-right collapse-button">
            -
        </span>
        </div>
        <div class="panel-body" style="overflow: hidden; display: block;">
        <div id="bingosync-plus-settings-box" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        </div>
        </div>
        </div>

        </div>`
        settingsContainer.lastElementChild.className = settingsContainer.lastElementChild.className + ' m-b-l';
        settingsContainer.appendChild(snippet.content.firstChild);
        buttonBox = document.getElementById('bingosync-plus-settings-box');

        document.getElementById("bingosync-plus-settings-collapse").addEventListener('mousedown', toggleView);
    }
    return buttonBox;
}

const buttonBox = ensureBingosyncPlusSettingsBox();

if (buttonBox) {
    const bspScreenshotButtonId = "bsp-screenshot-button";
    if (!document.getElementById(bspScreenshotButtonId)) {
        let screenshotButton = document.createElement('div');
        screenshotButton.id = bspScreenshotButtonId;
        screenshotButton.className = "btn btn-default";
        screenshotButton.title = "Copy an image of the board to your clipboard.";
        screenshotButton.innerText = "Screenshot";
        screenshotButton.onclick = dumpBoardToClipboard;
        buttonBox.appendChild(screenshotButton);
    }


    if (!document.getElementById(bspScreenshotImageId)) {
        const bspScreenshotImage = document.createElement("img");
        bspScreenshotImage.id = bspScreenshotImageId;
        bspScreenshotImage.setAttribute("height", '60px');
        bspScreenshotImage.setAttribute("width", '60px');
        bspScreenshotImage.style = "margin-top: 2px; border: 1px solid #202020";
        buttonBox.appendChild(bspScreenshotImage)
    }
}
