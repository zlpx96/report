// 双均线交叉策略
// 金叉（MA5上穿MA20）买入，死叉（MA5下穿MA20）卖出

function onBar(bar, context) {
  const { closes, position } = context;
  const fast = 5, slow = 20;
  if (closes.length < slow) return null;

  function sma(arr, n) {
    return arr.slice(-n).reduce((a, b) => a + b, 0) / n;
  }

  const ma5now  = sma(closes, fast);
  const ma20now = sma(closes, slow);
  const ma5prev  = sma(closes.slice(0, -1), fast);
  const ma20prev = sma(closes.slice(0, -1), slow);

  // 金叉：MA5 上穿 MA20
  if (ma5prev <= ma20prev && ma5now > ma20now && position === 0) {
    return { action: 'buy', amount: 1.0 };
  }
  // 死叉：MA5 下穿 MA20
  if (ma5prev >= ma20prev && ma5now < ma20now && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }
  return null;
}
