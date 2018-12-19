const webClient = require('request-promise');
const jq = require('node-jq');
const illFilter = '.[].newest_events.il.val';
const humFilter = '.[].newest_events.hu.val';
const temFilter = '.[].newest_events.te.val';

exports.pushSensor = async () => {
  const body = await webClient.get({
    url: "https://api.nature.global/1/devices",
    headers: {
      "Authorization": `Bearer ${process.env.TOKEN}`
    }
  });
  const ill = await jq.run(illFilter, body, {
    input: 'string'
  });
  const hum = await jq.run(humFilter, body, {
    input: 'string'
  });
  const tem = await jq.run(temFilter, body, {
    input: 'string'
  });
  console.log(`ill[${ill}] hum[${hum}] tem[${tem}]`)
  await webClient.post({
    url: "https://gw.machinist.iij.jp/endpoint",
    headers: {
      "Authorization": `Bearer ${process.env.MACHINISTKEY}`
    },
    json: {
      "agent": "remo-sensor",
      "metrics": [{
        "name": "temperature",
        "namespace": "home",
        "data_point": {
          "value": Number(tem)
        }
      }, {
        "name": "humidity",
        "namespace": "home",
        "data_point": {
          "value": Number(hum)
        }
      }, {
        "name": "illumination",
        "namespace": "home",
        "data_point": {
          "value": Number(ill)
        }
      }]
    }
  })
}