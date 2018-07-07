// Фоновый скрипт расширения: загружает список файлов и сообщает
// компонентам расширения его содержимое
"use strict";

const SITE_LIST_URL = "http://www.softomate.net/ext/employees/list.json";

// TODO: remove this
const SITES = [
    {
	"name": "yandex",
	"domain": "yandex.ru",
	"message": "Hello %username%! My name is Yandex!"
    },
    {
	"name": "google",
	"domain": "google.ru",
	"message": "Hello %username%! My name is Google!"
    },
    {
	"name": "bing",
	"domain": "bing.com",
	"message": "Hello %username%! My name is Bing!"
    }
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab
                ? "from a content script:" + sender.tab.url
                : "from the extension");
    if (request.action === "site_list")
    {
        let response = { sites: SITES };
        sendResponse({ sites: SITES });
    }
});
