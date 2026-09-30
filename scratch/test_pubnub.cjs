const https = require('https');

function pubnubPub(channel, payload) {
  return new Promise((resolve, reject) => {
    const url = `https://ps.pubnub.com/publish/demo/demo/0/${channel}/0/${encodeURIComponent(JSON.stringify(payload))}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function pubnubSub(channel, timetoken = '0') {
  return new Promise((resolve, reject) => {
    const url = `https://ps.pubnub.com/subscribe/demo/${channel}/0/${timetoken}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch(e) { resolve(body); }
      });
    }).on('error', reject);
  });
}

async function testPubNub() {
  const ch = 'bd_quest_room_BD_MAIN_v3';
  const testState = { viewMode: 'GAME', teams: [{ id: 'alfa', members: ['lucas', 'ovo'] }], lastUpdated: Date.now() };

  console.log("Publishing to PubNub...");
  const pRes = await pubnubPub(ch, testState);
  console.log("Pub result:", pRes);

  console.log("Subscribing from PubNub...");
  const sRes = await pubnubSub(ch, '0');
  console.log("Sub result:", JSON.stringify(sRes));
}

testPubNub();
