// Фоновый скрипт расширения: загружает список файлов и сообщает
// компонентам расширения его содержимое
"use strict";

const SITE_LIST_URL = "http://www.softomate.net/ext/employees/list.json";
// Один час в миллисекундах
const ONE_HOUR = 3600 * 1000;

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
        .then(response => {
            // Сохранить временную метку
            chromeSet("lastRefreshed", Date.now());
            return response.json();
        })
        .then(sites => {
            return chromeSet("sites", sites);
        });
}

function scheduleRefresh(url) {
    return chromeGet("lastRefreshed")
        .then(({ lastRefreshed }) => {
            // Предполагать, что время последнего обновления равно
            // нулю при первом запуске
            console.log("lastRefreshed = " + lastRefreshed);
            let delta = Date.now() - (lastRefreshed || 0);
            if (delta >= ONE_HOUR) {
                console.log("refreshing site list");
                refreshSitesFrom(url);
            }
            // Повторить вызов через delta миллисекунд
            setTimeout(scheduleRefresh, delta);
        });
}

// Обработчики сообщений
const actions = {
    "site_list": sendResponse => {
        return chromeGet("sites").then(sendResponse);
    },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (actions.hasOwnProperty(request.action)) {
        actions[request.action](sendResponse);
    } else {
        throw new TypeError("неизвестное действие: " + response.action);
    }
    // Чтобы sendResponse() мог работать асинхронно, нужно возвратить true:
    // <https://developer.chrome.com/extensions/messaging#simple>
    return true;
});


// При старте расширения запустить цикл обновления
scheduleRefresh(SITE_LIST_URL);
