const https = require('https');

function testUrl(name, url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(url, { timeout: 4000 }, (res) => {
      resolve({ name, status: res.statusCode, time: Date.now() - start });
    });
    req.on('error', (err) => resolve({ name, error: err.message, time: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ name, error: 'TIMEOUT', time: Date.now() - start }); });
  });
}

async function run() {
  const results = await Promise.all([
    testUrl('ntfy.sh', 'https://ntfy.sh/bd_quest_test'),
    testUrl('kvdb.io', 'https://kvdb.io/'),
    testUrl('firebase', 'https://banco-de-dados-quest-default-rtdb.firebaseio.com/.json'),
    testUrl('jsonbin', 'https://api.jsonbin.io/v3/b'),
    testUrl('api.restdb.io', 'https://restdb.io'),
    testUrl('pubnub', 'https://ps.pubnub.com/time/0'),
    testUrl('websocket-echo', 'https://echo.websocket.org'),
    testUrl('piehost', 'https://piehost.com')
  ]);
  console.log(JSON.stringify(results, null, 2));
}

run();
