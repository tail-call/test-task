// Вставляет иконки расширения в результатах поиска google и bing
"use strict";

function withoutWWW(str) {
    return str.replace(/^www\./, "");
}

function getHostFromURL(url) {
    return withoutWWW((new URL(url)).hostname);
}

// Эвристические функции для поиска места вставки иконки. Каждая
// возвращает массив элементов, перед которыми должна быть вставлена
// иконка.
const heuristics = {
    "google": hosts => {
        // Каждый результат поиска обрамлён элементом с классом .g
        return Array.from(document.querySelectorAll(".g"))
        // Извлекаем первый элемент <a> из каждого
            .map(el => el.getElementsByTagName("a")[0])
        // По непонятным причинам в выдаче могут оказаться ссылки с
        // href="mailto:...". Оставить только href="http..."
            .filter(a => a.href.startsWith("http"))
        // Оставить только ссылки, ссылающиеся на сайт из hosts
            .filter(a => hosts.includes(getHostFromURL(a.href)));
    },
    "bing": hosts => {
        // Каждый результат поиска обрамлён элементом с классом
        // .b_algo
        return Array.from(document.querySelectorAll(".b_algo"))
        // Извлекаем первый элемент <a> из каждого
            .map(el => el.getElementsByTagName("a")[0])
        // Оставить только ссылки, ссылающиеся на сайт из hosts
            .filter(a => hosts.includes(getHostFromURL(a.href)));
    }
};

// Выбирает эвристическую функцию для сайта с именем хоста host
function getHeuristicFor(host) {
    if (host.match("bing")) {
        return heuristics.bing;
    } else {
        return heuristics.google;
    }
}

function makeIcon() {
    let icon = document.createElement("img");
    icon.src = chrome.extension.getURL("icon.png");
    return icon;
}

// Вставляет иконки рядом с ссылками на сайты из массива hosts
// среди результатов поиска
function insertIcons(hosts) {
    let heuristic = getHeuristicFor(document.location.host);
    let nodes = heuristic(hosts);
    for (let node of nodes) {
        node.parentElement.insertBefore(makeIcon(), node);
    }
}

// Вставить иконки при загрузке страницы
chrome.runtime.sendMessage({ action: "listSites" }, ({ sites }) => {
    insertIcons(sites.map(site => site.domain));
});
