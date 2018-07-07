// Фоновый скрипт расширения: загружает список файлов и сообщает
// компонентам расширения его содержимое
"use strict";

const SITE_LIST_URL = "http://www.softomate.net/ext/employees/list.json";
// Один час в миллисекундах
const ONE_HOUR = 3600 * 1000;

function storageSetPromisified(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

function storageGetPromisified(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], resolve);
    });
}

function refreshSitesFrom(url) {
    return fetch(url)
        .then(response => {
            // Сохранить временную метку
            storageSetPromisified("lastRefreshed", Date.now());
            return response.json();
        })
        .then(sites => {
            return storageSetPromisified("sites", sites);
        });
}

function scheduleRefresh(url) {
    return storageGetPromisified("lastRefreshed")
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
    // Возвращает { sites: [список сайтов] }
    "listSites": (request, sender, sendResponse) => {
        return storageGetPromisified("sites").then(sendResponse);
    },

    // Возвращает число оставшихся посещений до того, как окно с
    // сообщением перестанет показываться в виде { displaysLeft: Number }
    "visit": (request, sender, sendResponse) => {
        // Число оставшихся показов сообщений записано в хранилище в
        // виде пар { "<host>:displaysLeft": Number }
        let key = `${request.host}:displaysLeft`;
        return storageGetPromisified(key)
            .then(keyValue => {
                let value = 3;
                if (key in keyValue) {
                    // Значение нашлось в хранилище
                    value = keyValue[key];
                }
                sendResponse({ displaysLeft: value });
                console.log("visited " + request.host + ", VISIT returned " + value);
                // Число оставшихся показов не может быть меньше нуля
                return storageSetPromisified(key, Math.max(0, value - 1));
            });
    },

    // Сигнализирует о закрытии окна с сообщением, число оставшихся
    // показов сбрасывается до нуля
    "closeMessage": (request, sender, sendResponse) => {
        console.log("closed window at " + request.host);
        let key = `${request.host}:displaysLeft`;
        return storageSetPromisified(key, 0)
            .then(sendResponse);
    },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (actions.hasOwnProperty(request.action)) {
        actions[request.action](request, sender, sendResponse);
    } else {
        throw new TypeError("неизвестное действие: " + response.action);
    }
    // Чтобы sendResponse() мог работать асинхронно, нужно возвратить true:
    // <https://developer.chrome.com/extensions/messaging#simple>
    return true;
});


// При старте расширения запустить цикл обновления
scheduleRefresh(SITE_LIST_URL);
