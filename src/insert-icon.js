// Вставляет иконку расширения в результатах поиска google и bing
"use strict";

// Эвристические функции для поиска места вставки иконки. Каждая
// возвращает массив элементов, перед которыми должна быть вставлена
// иконка.
const heuristics = {
    "google": (hosts) => {
        // Каждый результат поиска обрамлён элементом с классом .g
        return Array.from(document.querySelectorAll(".g"))
            // Извлекаем первый элемент <a> из каждого
            .map(el => el.getElementsByTagName("a")[0]);
    },
    "bing": () => {
        // Каждый результат поиска представлен в виде элемента div с
        // классом b_algo.
        return document.body;
    }
};

function makeIcon() {
    let icon = document.createElement("img");
    icon.src = chrome.extension.getURL("icon.png");
    return icon;
}

function insertIcons() {
    chrome.runtime.sendMessage({ action: "listSites" }, ({ sites }) => {
        let nodes = heuristics.google(sites.map(site => site.domain));
        for (let node of Array.from(nodes)) {
            node.parentElement.insertBefore(makeIcon(), node);
        }
    });
}

insertIcons();
