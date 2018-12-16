const webClient = require('request-promise');
const jq = require('node-jq');
const jqFilter = '.[].newest_events.il.val';

const getIll = async () => {
  const body = await webClient.get({
    url: "https://api.nature.global/1/devices",
    headers: {
      "Authorization": `Bearer ${process.env.TOKEN}`
    }
  });
  const ill = await jq.run(jqFilter, body, {
    input: 'string'
  });
  return ill;
}

const sendSignal = async () => {
  const body = await webClient.post({
    url: `https://api.nature.global/1/signals/${process.env.SIGNAL}/send`,
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${process.env.TOKEN}`
    }
  });
}

exports.lightOff = async () => {
  let ill = await getIll();
  console.log(`lightoff illumination is ${ill}`)
  if (Number(ill) > 50) {
    await sendSignal();
    await sendSignal();
    await sendSignal();
    return true;
  }
  return false;
}

exports.lightOn = async () => {
  let ill = await getIll();
  console.log(`lighton illumination is ${ill}`)
  if (Number(ill) < 80) {
    await sendSignal();
    return true;
  }
  return false;
}