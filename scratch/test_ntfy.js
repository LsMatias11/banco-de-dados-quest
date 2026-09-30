const https = require('https');

function publish(topic, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(`https://ntfy.sh/${topic}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

function poll(topic) {
  return new Promise((resolve, reject) => {
    https.get(`https://ntfy.sh/${topic}/json?poll=1`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function test() {
  console.log("Publishing test payload...");
  const pubRes = await publish('bd_quest_room_BD_MAIN_v2', { test: true, time: Date.now() });
  console.log("Publish result:", pubRes);

  console.log("Polling...");
  const pollRes = await poll('bd_quest_room_BD_MAIN_v2');
  console.log("Poll result raw:", pollRes);
}

test();
