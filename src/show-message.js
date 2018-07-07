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

async function sendMessagePromisified(arg) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(arg, resolve);
    });
}

// Внедряет HTML-код с сообщением для пользователя, если имя хоста
// сервера, обслуживающего текущую страницу, совпадает со значением
// свойства domain одного из объектов среди массива sites, где sites
// имеет вид [{ name, domain, message } ...].
async function showMessageAt(sites) {
    let currentHost = withoutWWW(document.location.host);
    let hostData = findByHost(currentHost, sites);
    if (!hostData) {
        return;
    }

    let { displaysLeft } = await sendMessagePromisified({
        action: "visit",
        host: currentHost
    });
    if (displaysLeft <= 0) {
        return;
    }

    // Поместить окно с сообщением на страницу и заменить в нём
    // текст
    let messageBox = makeMessageBox();
    document.body.appendChild(messageBox);
    document.getElementById("super-extension_text")
        .appendChild(document.createTextNode(hostData.message));

    // При клике на кнопку — закрыть окно
    document.getElementById("super-extension_close")
        .addEventListener("click", (ev) => {
            chrome.runtime.sendMessage({
                action: "closeMessage",
                host: currentHost
            });
            document.body.removeChild(messageBox);
        });
}

chrome.runtime.sendMessage({ action: "listSites" },
                           ({ sites }) => showMessageAt(sites));
