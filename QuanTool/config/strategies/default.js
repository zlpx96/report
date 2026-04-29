// QuanTool Strategy
// onBar is called for each K-line bar
// Return a TradeSignal or null to hold

function onBar(bar, context) {
  const { closes, capital, position } = context;

  const period = 20;
  if (closes.length < period) return null;

  const ma = closes.slice(-period).reduce((a, b) => a + b, 0) / period;

  if (bar.close > ma && position === 0) {
    return { action: 'buy', amount: 0.5 };
  }

  if (bar.close < ma && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }

  return null;

}
