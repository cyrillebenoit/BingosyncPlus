// Anti Modes
// 0 -> None
// 1 -> Anti Star
// 2 -> Half Faded Text
// 3 -> Transparent Text

function addAntiStarHandlers() {
    for (let i = 1; i <= 25; i++) {
        // If there isn't a AntiStar div yet for that slot
        if (!document.getElementById(`antistar_${i}`)) {
            const slot = document.getElementById(`slot${i}`);

            const antistar = document.createElement("div");
            antistar.id = `antistar_${i}`;
            antistar.className = 'antistarred';
            antistar.style.display = 'none';
            antistar.antiMode = 0;

            slot.insertBefore(antistar, slot.childNodes.item(1));

            const clickHandler = document.createElement("div");
            slot.insertBefore(clickHandler, slot.childNodes.item(0));
            clickHandler.id = `clickhandler_${i}`;
            clickHandler.style.height = '100%';
            clickHandler.style.width = '50%';
            clickHandler.style.right = '0';
            clickHandler.style.position = 'absolute';
            clickHandler.style.zIndex = '1';

            clickHandler.addEventListener("contextmenu", e => {
                e.preventDefault();
                e.stopPropagation();
                // get current anti mode
                const antistar = document.getElementById(`antistar_${i}`);
                const textContainer = document.getElementById(`slot${i}`);

                const mode = antistar.antiMode;
                antistar.antiMode = (mode + 1) % 4;

                // undo anti effect and apply new effect
                switch (mode) {
                    case 0:
                        antistar.style.display = 'block';
                        break;
                    case 1:
                        antistar.style.display = 'none';
                        textContainer.style.color = 'rgba(255, 255, 255, 0.5)';
                        textContainer.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
                        break;
                    case 2:
                        textContainer.style.color = 'rgba(255, 255, 255, 0)';
                        textContainer.style.textShadow = 'none';
                        break;
                    case 3:
                        textContainer.style.color = 'rgba(255, 255, 255, 1)';
                        textContainer.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
                        break;
                }
            });
        } else {
            //Make sure the correct effect is in use
            const antistar = document.getElementById(`antistar_${i}`);
            const textContainer = document.getElementById(`slot${i}`);

            const mode = antistar?.antiMode || 0;

            // undo anti effect and apply new effect
            switch (mode) {
                case 0:
                    antistar.style.display = 'none';
                    textContainer.style.color = 'rgba(255, 255, 255, 1)';
                    textContainer.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
                    break;
                case 1:
                    antistar.style.display = 'block';
                    textContainer.style.color = 'rgba(255, 255, 255, 1)';
                    textContainer.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
                    break;
                case 2:
                    antistar.style.display = 'none';
                    textContainer.style.color = 'rgba(255, 255, 255, 0.5)';
                    textContainer.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
                    break;
                case 3:
                    antistar.style.display = 'none';
                    textContainer.style.color = 'rgba(255, 255, 255, 0)';
                    textContainer.style.textShadow = 'none';
                    break;
            }
        }
    }
}

new MutationObserver(addAntiStarHandlers).observe(document.getElementById("bingo-chat"), {
    attributes: true,
    childList: true,
    subtree: true
});

console.log("Antistar module loaded.")

