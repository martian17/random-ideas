const res = await fetch("https://service.berlin.de/terminvereinbarung/termin/day/1704063600/", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "bo_vtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAzOmZhOjE3Mjg6NTEwMDo4ODhlOmNjZDpkYzUxOmNjMjciLCJpc3MiOiJzZXJ2aWNlLmJlcmxpbi5kZSIsImV4cCI6MTcwMzc1MzQzNCwibmJmIjoxNzAzNzUzMTA0fQ.AUAqJ-MNOFuWyRMeLEKUzEpw0S2rL5_Zy2ZsMc7_It8; zmsappointment-session=inProgress; bo_vtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAzOmZhOjE3Mjg6NTEwMDo4ODhlOmNjZDpkYzUxOmNjMjciLCJpc3MiOiJzZXJ2aWNlLmJlcmxpbi5kZSIsImV4cCI6MTcwMzc1MzU1MSwibmJmIjoxNzAzNzUzMjIxfQ.GeNs_dE4_RLPUp9xhEVwf8NKiJ6yr8DYvWPtMH8g1X8; Zmsappointment=khq966dkt640dgmsu7k270m24a; wt_rla=102571513503709%2C17%2C1703753065470",
    "Referer": "https://service.berlin.de/terminvereinbarung/termin/day/1701385200/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

console.log(res.cookie);

console.log(await res.text());

