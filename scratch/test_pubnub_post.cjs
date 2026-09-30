const https = require('https');

function pubnubPost(channel, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'ps.pubnub.com',
      path: `/publish/demo/demo/0/${channel}/0`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function pubnubHistory(channel) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ps.pubnub.com',
      path: `/v2/history/sub-key/demo/channel/${channel}?count=1`,
      method: 'GET'
    };
    https.get(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function test() {
  const ch = 'bd_quest_global_v6';
  const state = { viewMode: 'GAME', teams: [{ id: 'alfa', members: ['Lucas', 'Matias'] }], lastUpdated: Date.now() };

  console.log("Publishing via POST to PubNub...");
  const pubRes = await pubnubPost(ch, state);
  console.log("Post status:", pubRes.status, pubRes.body);

  console.log("Fetching history from PubNub...");
  const hist = await pubnubHistory(ch);
  console.log("History:", JSON.stringify(hist));
}

test();
