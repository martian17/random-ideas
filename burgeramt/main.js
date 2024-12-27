
const holeMonatsanfang = function(){
    const datum = new Date();
    const jahr = datum.getUTCFullYear();
    console.log(jahr);
    const monat = datum.getUTCMonth();
    return Math.floor((new Date(`${jahr}-${monat+1}-1T00:00:00.000+1`)).getTime()/1000);
};

const holeKalender = async function(){
    const zeitstempel = holeMonatsanfang();
    const antwort = await fetch("https://service.berlin.de/terminvereinbarung/termin/day/1701385200/", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
    },
    "referrer": "https://service.berlin.de/terminvereinbarung/termin/day/1704063600/",
    "method": "GET",
    "mode": "cors"
});
    // const antwort = await fetch(`https://service.berlin.de/terminvereinbarung/termin/day/${zeitstempel}/`, {
    //     "credentials": "include",
    //     "headers": {
    //         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0",
    //         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    //         "Accept-Language": "en-US,en;q=0.5",
    //         "Upgrade-Insecure-Requests": "1",
    //         "Sec-Fetch-Dest": "document",
    //         "Sec-Fetch-Mode": "navigate",
    //         "Sec-Fetch-Site": "same-origin"
    //     },
    //     "referrer": `https://service.berlin.de/terminvereinbarung/termin/day/1701385200/`,
    //     "method": "GET",
    //     "mode": "cors"
    // });
    const text = await antwort.text();
    console.log(text);
}

holeKalender();



