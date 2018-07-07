// Скрипт показывает сообщение для сайтов из списка, управляемого
// расширением
"use strict";

function withoutWWW(str) {
    return str.replace(/^www\./, "");
}

function findByHost(host, sites)
{
    return sites.find(({ domain }) => domain == host);
}

function showMessageAt(sites) {
    let currentHost = withoutWWW(document.location.host);
    let hostData = findByHost(currentHost, sites);
    if (hostData)
    {
        alert(hostData.message);
    }
}

chrome.runtime.sendMessage({ action: "site_list" },
                           ({ sites }) => showMessageAt(sites));
