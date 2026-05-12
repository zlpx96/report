function onBar(bar, context) {
  const closes = context.closes;
  const position = context.position;
  const capital = context.capital;
  const avgCost = context.avgCost;

  // 数据不足时跳过
  if (closes.length < 60) return null;

  // ── 上升周期判断：短期均线 > 长期均线 ──
  const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const ma60 = closes.slice(-60).reduce((a, b) => a + b, 0) / 60;
  const isUptrend = ma20 > ma60;

  const close = bar.close;

  // ── 卖出逻辑：持仓且当前价高于均价 5% ──
  if (position > 0 && close >= avgCost * 1.05) {
    // 每次卖出 100 股（1手），计算占总持仓比例
    const sellRatio = Math.min(100 / position, 1.0);
    return { action: 'sell', amount: sellRatio };
  }

  // ── 买入逻辑：上升周期 + 当前价低于上次买入均价 2% ──
  if (isUptrend) {
    // 首次建仓：无持仓时直接买入
    if (position === 0) {
      // 用 1手资金（100股）占总资金比例买入
      const oneLotCost = close * 100;
      if (capital >= oneLotCost) {
        const buyRatio = oneLotCost / capital;
        return { action: 'buy', amount: buyRatio };
      }
    }

    // 加仓：当前价比持仓均价低 2%
    if (position > 0 && close <= avgCost * 0.98) {
      const oneLotCost = close * 100;
      if (capital >= oneLotCost) {
        const buyRatio = oneLotCost / capital;
        return { action: 'buy', amount: buyRatio };
      }
    }
  }

  return null;
}