/* Probability model is shared with the original simulator; see README for assumptions. */
importScripts('./engine.js');
self.onmessage = function (event) {
  var options = event.data;
  if (!Number.isInteger(options.copies) || options.copies < 1 || options.copies > 14 || ![20000, 100000].includes(options.runs) || !Number.isInteger(options.budget) || options.budget < 0 || options.budget > 10000 || !options.settings) { self.postMessage({error: true}); return; }
  var settings = options.settings;
  if (!Number.isInteger(settings.fivePity) || settings.fivePity < 0 || settings.fivePity > 89 || !Number.isInteger(settings.radianceLosses) || settings.radianceLosses < 0 || settings.radianceLosses > 3) { self.postMessage({error: true}); return; }
  var totals = new Uint16Array(options.runs), success = 0, sum = 0;
  for (var run = 0; run < options.runs; run++) {
    var state = {fivePity: settings.fivePity, fourPity: 0, guaranteed5: settings.guaranteed5, radianceLosses: settings.radianceLosses};
    var copies = 0, pulls = 0;
    while (copies < options.copies && pulls < options.copies * 180) {
      pulls++;
      if (Math.random() < fiveRate(state.fivePity + 1)) {
        if (predictionFiveOutcome(state, Math.random) === 5) copies++;
      } else state.fivePity++;
    }
    totals[run] = pulls; sum += pulls;
    if (pulls <= options.budget) success++;
    if (run % 1000 === 0) self.postMessage({progress: Math.floor(run / options.runs * 100)});
  }
  totals.sort();
  function quantile(p) { return totals[Math.ceil(p * options.runs) - 1]; }
  // Wilson interval half-width remains informative even when all trials succeed/fail.
  var rate = success / options.runs, z2 = 1.96 * 1.96;
  var margin = 1.96 * Math.sqrt(rate * (1 - rate) / options.runs + z2 / (4 * options.runs * options.runs)) / (1 + z2 / options.runs);
  self.postMessage({done: true, rate: rate, q50: quantile(.5), q90: quantile(.9), q95: quantile(.95), mean: sum / options.runs, margin: margin + Math.abs((rate + z2 / (2 * options.runs)) / (1 + z2 / options.runs) - rate)});
};
