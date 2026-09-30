const https = require('https');

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const u = new URL(url);
    const req = https.request(u, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get(u, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function testServices() {
  console.log("--- Testing jsonblob.com ---");
  try {
    const r1 = await postJson('https://jsonblob.com/api/jsonBlob', { room: 'BD-MAIN', time: Date.now() });
    console.log("jsonblob POST:", r1.status, r1.headers.location);
    if (r1.headers.location) {
      const getUrl = r1.headers.location.replace('http:', 'https:');
      const r1get = await getJson(getUrl);
      console.log("jsonblob GET:", r1get.status, r1get.body);
    }
  } catch(e) { console.error("jsonblob error:", e.message); }

  console.log("--- Testing npoint.io ---");
  try {
    const r2 = await postJson('https://api.npoint.io/documents', { room: 'BD-MAIN', time: Date.now() });
    console.log("npoint POST:", r2.status, r2.body);
  } catch(e) { console.error("npoint error:", e.message); }

  console.log("--- Testing PubNub Demo Key ---");
  try {
    const pubUrl = 'https://ps.pubnub.com/publish/demo/demo/0/bd_quest_room_BD_MAIN/0/' + encodeURIComponent(JSON.stringify({ test: true, time: Date.now() }));
    const r3 = await getJson(pubUrl);
    console.log("pubnub PUB:", r3.status, r3.body);
  } catch(e) { console.error("pubnub error:", e.message); }
}

testServices();
