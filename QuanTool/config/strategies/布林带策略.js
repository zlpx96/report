// 布林带策略
// 价格触及下轨买入，触及上轨卖出

function onBar(bar, context) {
  const { closes, position } = context;
  const period = 20, multiplier = 2;
  if (closes.length < period) return null;

  const slice = closes.slice(-period);
  const ma = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((a, b) => a + (b - ma) ** 2, 0) / period);
  const upper = ma + multiplier * std;
  const lower = ma - multiplier * std;

  // 价格触及下轨 → 买入
  if (bar.close <= lower && position === 0) {
    return { action: 'buy', amount: 1.0 };
  }

  // 价格触及上轨 → 卖出
  if (bar.close >= upper && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }

  return null;
}
