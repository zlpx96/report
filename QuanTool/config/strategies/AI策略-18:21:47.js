function onBar(bar, context) {
  const { closes, highs, lows, position, avgCost } = context;

  // 数据不足时跳过
  const N = 9;
  if (closes.length < N + 3) return null;

  // 计算 KDJ 的 RSV（Raw Stochastic Value）
  const recentHighs = highs.slice(-N);
  const recentLows  = lows.slice(-N);
  const hh = Math.max(...recentHighs);
  const ll = Math.min(...recentLows);
  const rsv = hh === ll ? 50 : ((bar.close - ll) / (hh - ll)) * 100;

  // 用简化方式计算 K、D（EMA 平滑，初始值 50）
  // 取最近几根 RSV 做近似
  const rsvArr = [];
  for (let i = 1; i <= 3; i++) {
    const c  = closes.slice(0, -i);
    const h  = highs.slice(0, -i);
    const l  = lows.slice(0, -i);
    const hh = Math.max(...h.slice(-N));
    const ll = Math.min(...l.slice(-N));
    rsvArr.unshift(hh === ll ? 50 : ((c[c.length - 1] - ll) / (hh - ll)) * 100);
  }
  rsvArr.push(rsv);

  let k = 50, d = 50;
  for (const r of rsvArr) {
    k = (2 / 3) * k + (1 / 3) * r;
    d = (2 / 3) * d + (1 / 3) * k;
  }
  const j = 3 * k - 2 * d;

  // 20 日均线过滤趋势
  if (closes.length < 20) return null;
  const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;

  // 止损：亏损超过 5%
  if (position > 0 && bar.close < avgCost * 0.95) {
    return { action: 'sell', amount: 1.0 };
  }

  // 止盈：盈利超过 15%
  if (position > 0 && bar.close > avgCost * 1.15) {
    return { action: 'sell', amount: 1.0 };
  }

  // 买入信号：J < 20（超卖）且价格在均线上方（上升趋势）
  if (j < 20 && bar.close > ma20 && position === 0) {
    return { action: 'buy', amount: 0.8 };
  }

  // 卖出信号：J > 80（超买）
  if (j > 80 && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }

  return null;
}