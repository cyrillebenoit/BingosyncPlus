function dumpBoardToClipboard() {
    const tableToDump = document.getElementById('bingo');
    domtoimage.toBlob(tableToDump).then(function (theBlob) {
        navigator.clipboard.write([
            new ClipboardItem({
                [theBlob.type]: theBlob
            })
        ]);
    });
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
        Bingosync Plus Functions
        </span>
        </div>
        <div class="panel-body" style="overflow: hidden; display: block;">
        <div id="bingosync-plus-settings-box">
        </div>
        </div>
        </div>

        </div>`
        settingsContainer.lastElementChild.className = settingsContainer.lastElementChild.className + ' m-b-l';
        settingsContainer.appendChild(snippet.content.firstChild);
        buttonBox = document.getElementById('bingosync-plus-settings-box');
    }
    return buttonBox;
}

const buttonBox = ensureBingosyncPlusSettingsBox();

if (buttonBox) {
    let screenshotButton = document.createElement('div');
    screenshotButton.className = "btn btn-default";
    screenshotButton.title = "Copy an image of the board to your clipboard.";
    screenshotButton.innerText = "Screenshot";
    screenshotButton.onclick = dumpBoardToClipboard;
    buttonBox.appendChild(screenshotButton);
}
