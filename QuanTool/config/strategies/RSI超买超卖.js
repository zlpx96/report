// RSI 超买超卖策略
// RSI < 30 买入，RSI > 70 卖出

function onBar(bar, context) {
  const { closes, position } = context;
  const period = 14;
  if (closes.length < period + 1) return null;

  // 计算 RSI
  const recent = closes.slice(-(period + 1));
  let gains = 0, losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  if (rsi < 30 && position === 0) {
    return { action: 'buy', amount: 1.0 };
  }
  if (rsi > 70 && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }
  return null;
}
