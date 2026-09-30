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

function pubnubSub(channel, timetoken) {
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

async function run() {
  const ch = 'bd_quest_room_BD_MAIN_v3';
  const pub1 = await pubnubPub(ch, { viewMode: 'LOBBY', teams: [{ id: 'alfa', members: ['Lucas'] }], lastUpdated: Date.now() });
  console.log("Pub 1:", pub1);
  const timetoken = pub1[2];

  const sub1 = await pubnubSub(ch, timetoken);
  console.log("Sub 1 (should wait/return empty if no new msg):", sub1);

  const pub2 = await pubnubPub(ch, { viewMode: 'GAME', teams: [{ id: 'alfa', members: ['Lucas', 'Ovo'] }], lastUpdated: Date.now() });
  console.log("Pub 2:", pub2);

  const sub2 = await pubnubSub(ch, timetoken);
  console.log("Sub 2 (should get Pub 2 msg):", JSON.stringify(sub2));
}

run();
