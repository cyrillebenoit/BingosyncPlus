const bspScreenshotImageId = 'bsp-screenshot-image';
const bspScreenshotButtonId = "bsp-screenshot-button";

function dumpBoardToClipboard() {
    const screenshotButton = document.getElementById(bspScreenshotButtonId);
    screenshotButton.innerText = "One second...";

    // Check if card is revealed
    const boardIsShown = document.getElementsByClassName("board-cover")[0].style.display === 'none';

    if (!boardIsShown) {
        screenshotButton.innerText = "No";
        setTimeout(() => screenshotButton.innerText = "Screenshot", 1000);
        return;
    }


    const tableToDump = document.getElementById('bsp-board-container');
    domtoimage.toBlob(tableToDump).then(blob => {
        // Firefox doesn't implement the constructor,
        // nor does it support adding non text content to clipboards via client side JS
        // This check is a proper guard against that scenario.
        if (typeof ClipboardItem != "undefined") {
            navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            screenshotButton.innerText = "Copied!";
            setTimeout(() => screenshotButton.innerText = "Screenshot", 2500);
        } else {
            browser.runtime.sendMessage({
                type: "fileToClip",
                blob: blob
            }).then(copied => {
                if (!copied) {
                    const objectURL = URL.createObjectURL(blob);
                    const screenshotImage = document.getElementById(bspScreenshotImageId);
                    if (screenshotImage) {
                        screenshotImage.onload(() => URL.revokeObjectURL(this.src));
                        screenshotImage.src = objectURL;
                        screenshotImage.className = "";
                    }
                } else {
                    screenshotButton.innerText = "Copied!";
                    setTimeout(() => screenshotButton.innerText = "Screenshot", 2500);
                }
            });
        }
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
        <div style="line-height: 18px; font-size: 90%">
            <div class="checkbox m-b-s" style="margin-top: 0">
                <label>
                    <input id="timestamp-checkbox" type="checkbox" checked>
                    Timestamps
                </label>
            </div>
            <div class="checkbox m-b-s">
                <label>
                    <input id="antistar-checkbox" type="checkbox">
                    Anti Stars
                </label>
            </div>
            <div class="checkbox m-b-s">
                <label>
                    <input id="anti50-checkbox" type="checkbox">
                    50% Opacity
                </label>
            </div>
            <div class="checkbox m-b-s">
                <label>
                    <input id="anti100-checkbox" type="checkbox">
                    0% Opacity
                </label>
            </div>     
        </div>
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
    if (document.getElementById("timestamp-checkbox")) {
        document.getElementById("timestamp-checkbox").addEventListener("click", () => {
            // set timestamp visibility
            const visible = document.getElementById("timestamp-checkbox").checked;
            for (const element of document.getElementsByClassName("bsp-timestamp")) {
                element.style.display = visible ? 'inline' : 'none';
            }
        });
    }
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
        bspScreenshotImage.className = "hidden";
        buttonBox.appendChild(bspScreenshotImage)
    }
}

console.log("Board Functions module loaded.")
