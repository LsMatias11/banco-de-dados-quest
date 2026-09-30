const https = require('https');

function putKv(bucket, key, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = https.request(`https://kvdb.io/${bucket}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getKv(bucket, key) {
  return new Promise((resolve, reject) => {
    https.get(`https://kvdb.io/${bucket}/${key}`, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          resolve(body);
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  const bucket = 'BDQuestRoom2026';
  const key = 'BD-MAIN';
  const testData = { viewMode: 'GAME', teams: [{ id: 'alfa', members: ['Lucas', 'Ovo'] }], lastUpdated: Date.now() };

  console.log("Writing to KV...");
  const putRes = await putKv(bucket, key, testData);
  console.log("Put result:", putRes);

  console.log("Reading from KV...");
  const getRes = await getKv(bucket, key);
  console.log("Get result:", getRes);
}

test();
