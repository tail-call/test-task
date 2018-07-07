// Скрипт показывает сообщение для сайтов из списка, управляемого
// расширением
"use strict";

const MESSAGE_BOX_CLASS_NAME = "super-extension_message-box";
const MESSAGE_TEMPLATE = `
<div id="super-extension_text"></div>
<button id="super-extension_close">Закрыть</button>
`;

function makeMessageBox(text) {
    let messageBox = document.createElement("div");
    messageBox.className = "super-extension_message-box";
    messageBox.innerHTML = MESSAGE_TEMPLATE;
    return messageBox;
}

function withoutWWW(str) {
    return str.replace(/^www\./, "");
}

function findByHost(host, sites) {
    return sites.find(({ domain }) => domain === host);
}

function showMessageAt(sites) {
    let currentHost = withoutWWW(document.location.host);
    let hostData = findByHost(currentHost, sites);
    if (hostData) {
        // Поместить окно с сообщением на страницу и заменить в нём
        // текст
        let messageBox = makeMessageBox();
        document.body.appendChild(messageBox);
        document.getElementById("super-extension_text")
            .appendChild(document.createTextNode(hostData.message));
        // При клике на кнопку — закрыть окно
        document.getElementById("super-extension_close")
            .addEventListener("click", (ev) => {
                document.body.removeChild(messageBox);
            });
    }
}

chrome.runtime.sendMessage({ action: "site_list" },
                           ({ sites }) => showMessageAt(sites));
