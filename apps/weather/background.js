// Runs with Sky closed (LytsoCoder background task): every hour, warn when rain is likely in the next 3 hours.
(globalThis.LytsoCoder || globalThis.AntiGem).background.on('rain-check', async (task) => {
  await import('/shared.js'); // defines globalThis.Sky (weather codes, forecast URL)
  const cities = (globalThis.LytsoCoder || globalThis.AntiGem).storage.get('cities', []);
  if (!cities.length || (globalThis.LytsoCoder || globalThis.AntiGem).storage.get('rainAlerts', true) === false) return;
  const city = cities[0];
  const data = await (await fetch(Sky.url(city, (globalThis.LytsoCoder || globalThis.AntiGem).storage.get('units', 'metric')))).json();
  localStorage.setItem('cache:' + city.id, JSON.stringify({ at: Date.now(), data }));
  const p = Sky.rainSoon(data, 3);
  (globalThis.LytsoCoder || globalThis.AntiGem).storage.set('lastCheck', { at: Date.now(), city: city.name, rain: p, reason: task.reason });
  if (p >= 60) {
    await (globalThis.LytsoCoder || globalThis.AntiGem).notify.show({ title: `☔ Rain likely in ${city.name}`, body: `${p}% chance of rain in the next 3 hours. Take an umbrella.`, tag: 'rain' });
  }
});
