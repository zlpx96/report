function onBar(bar, context) {
  const closes = context.closes;
  const position = context.position;
  const avgCost = context.avgCost;
  const period = 14;

  // 数据不足时跳过
  if (closes.length < period + 1) return null;

  // 计算 RSI
  const recent = closes.slice(-(period + 1));
  let gains = 0, losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  // 止损：亏损超过 5% 强制清仓
  if (position > 0 && bar.close < avgCost * 0.95) {
    return { action: 'sell', amount: 1.0 };
  }

  // RSI 低于 30 超卖 → 买入
  if (rsi < 30 && position === 0) {
    return { action: 'buy', amount: 1.0 };
  }

  // RSI 高于 70 超买 → 卖出
  if (rsi > 70 && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }

  return null;
}