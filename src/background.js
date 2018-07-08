// Фоновый скрипт расширения: загружает список файлов и сообщает
// компонентам расширения его содержимое
"use strict";

const SITE_LIST_URL = "http://www.softomate.net/ext/employees/list.json";
// Один час в миллисекундах
const ONE_HOUR = 3600 * 1000;

// В visits хранится число посещений каждого сайта из списка.
const visits = new Map();

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
    "listSites": async (request, sender, sendResponse) => {
        sendResponse(await storageGetPromisified("sites"));
    },

    // Возвращает число оставшихся посещений до того, как окно с
    // сообщением перестанет показываться в виде { displaysLeft: Number }
    "visit": async (request, sender, sendResponse) => {

        // Проверить, не было ли окно на этом сайте ранее закрыто
        let wasClosed = (await storageGetPromisified(`${request.host}:closed`));
        if (wasClosed[`${request.host}:closed`]) {
            sendResponse({ displaysLeft: 0 });
            return;
        }

        let visitsCount = 3;
        if (visits.has(request.host)) {
            visitsCount = visits.get(request.host);
        }

        sendResponse({ displaysLeft: visitsCount });

        // Число оставшихся показов не может быть меньше нуля
        visits.set(request.host, Math.max(0, visitsCount - 1));
    },

    // Сигнализирует о закрытии окна с сообщением
    "closeMessage": async (request, sender, sendResponse) => {
        console.log("closed window at " + request.host);
        await storageSetPromisified(`${request.host}:closed`, true);
        sendResponse();
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
