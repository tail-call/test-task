// Фоновый скрипт расширения: загружает список файлов и сообщает
// компонентам расширения его содержимое
"use strict";

const SITE_LIST_URL = "http://www.softomate.net/ext/employees/list.json";

// Функции-обёртки для chrome.storage на промисах

function chromeSet(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

function chromeGet(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], resolve);
    });
}

function refreshSitesFrom(url) {
    return fetch(url)
        .then(response => response.json())
        .then(sites => {
            return chromeSet("sites", sites);
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab
                ? "from a content script:" + sender.tab.url
                : "from the extension");

    if (request.action === "site_list") {
        chromeGet("sites").then(sendResponse);
    }

    // Чтобы sendResponse() мог работать асинхронно, нужно возвратить true.
    // <https://developer.chrome.com/extensions/messaging#simple>
    return true;
});

refreshSitesFrom(SITE_LIST_URL);
