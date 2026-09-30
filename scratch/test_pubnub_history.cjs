const https = require('https');

function pubnubHistory(channel) {
  return new Promise((resolve, reject) => {
    const url = `https://ps.pubnub.com/v2/history/sub-key/demo/channel/${channel}?count=1`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch(e) { resolve(body); }
      });
    }).on('error', reject);
  });
}

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

async function test() {
  const ch = 'bd_quest_channel_BD_MAIN_v4';
  console.log("Publishing test state...");
  await pubnubPub(ch, { viewMode: 'LOBBY', teams: [{ id: 'alfa', members: ['Lucas', 'Ovo'] }], lastUpdated: Date.now() });

  console.log("Fetching history...");
  const hist = await pubnubHistory(ch);
  console.log("History result:", JSON.stringify(hist));
}

test();
