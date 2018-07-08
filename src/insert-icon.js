// Вставляет иконки расширения в результатах поиска google и bing
"use strict";

function withoutWWW(str) {
    return str.replace(/^www\./, "");
}

function getHostFromURL(url) {
    return withoutWWW((new URL(url)).hostname);
}

// Эвристический алгоритм для нахождения ссылок в результатах
// поиска. Параметр wrapperClass — имя класса, присвоенного элементам
// с результатами поиска
function findSearchResults(hosts, wrapperClass) {
    return Array.from(document.querySelectorAll(wrapperClass))
    // Извлекаем первый элемент <a> из каждого
        .map(el => el.getElementsByTagName("a")[0])
    // Оставить только href="http..."
        .filter(a => a.href.startsWith("http"))
    // Оставить только ссылки, ссылающиеся на сайт из hosts
        .filter(a => hosts.includes(getHostFromURL(a.href)));
}

// Имена классов элементов с результатами поиска на разных поисковых
// сайтах
const wrapperClasses = {
    "google.com": ".g",
    "google.ru": ".g",
    "bing.com": ".b_algo"
};

function makeIcon() {
    let icon = document.createElement("img");
    icon.src = chrome.extension.getURL("icon.png");
    return icon;
}

// Вставляет иконки рядом с ссылками на сайты из массива hosts
// среди результатов поиска
function insertIcons(hosts) {
    let nodes = findSearchResults(
        hosts,
        wrapperClasses[withoutWWW(document.location.host)]
    );
    for (let node of nodes) {
        node.parentElement.insertBefore(makeIcon(), node);
    }
}

// Вставить иконки при загрузке страницы
chrome.runtime.sendMessage({ action: "listSites" }, ({ sites }) => {
    insertIcons(sites.map(site => site.domain));
});
