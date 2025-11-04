// A tiny worker that posts a "tick" message on a precise setTimeout loop.
// Keeps the loop off the main thread to avoid timer clamping.
self.onmessage = function (e) {
  const data = e.data || {};
  if (data && data.command === 'start') {
    const lookahead = data.lookahead || 25; // ms
    let running = true;
    function tick() {
      if (!running) return;
      self.postMessage({ type: 'tick', now: performance.now() });
      setTimeout(tick, lookahead);
    }
    tick();
    self.onmessage = function (ev) {
      if (ev.data && ev.data.command === 'stop') running = false;
    };
  }
};
