I'll skip the brainstorming workflow here since this is a direct code generation request with a clear spec already provided in the system prompt.

function onBar(bar, context) {
  const closes = context.closes;
  const position = context.position;
  const avgCost = context.avgCost;

  if (closes.length < 20) return null;

  const ma5 = closes.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;

  const prevCloses = closes.slice(0, -1);
  const prevMa5 = prevCloses.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const prevMa20 = prevCloses.slice(-20).reduce((a, b) => a + b, 0) / 20;

  if (position > 0 && bar.close < avgCost * 0.95) {
    return { action: 'sell', amount: 1.0 };
  }

  if (position > 0 && ma5 < ma20 && prevMa5 >= prevMa20) {
    return { action: 'sell', amount: 1.0 };
  }

  if (position === 0 && ma5 > ma20 && prevMa5 <= prevMa20) {
    return { action: 'buy', amount: 0.8 };
  }

  return null;
}

这是一个双均线交叉策略：
- **买入**：5日均线从下向上穿越20日均线（金叉），全仓的80%买入
- **卖出**：5日均线从上向下穿越20日均线（死叉），全仓卖出
- **止损**：持仓亏损超过5%时强制止损卖出