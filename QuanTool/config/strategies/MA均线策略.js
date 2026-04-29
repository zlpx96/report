/**
 * QuanTool 策略模板 - MA均线策略
 *
 * 每根K线调用一次 onBar(bar, context)
 * 返回交易信号对象，或返回 null 表示持仓不变
 *
 * ── bar 当前K线 ──────────────────────────
 *   bar.date    string   日期 'YYYY-MM-DD'
 *   bar.open    number   开盘价
 *   bar.high    number   最高价
 *   bar.low     number   最低价
 *   bar.close   number   收盘价
 *   bar.volume  number   成交量
 *   bar.index   number   在全部K线中的序号(0开始)
 *
 * ── context 上下文 ───────────────────────
 *   context.closes   number[]  历史收盘价(含当前)
 *   context.opens    number[]  历史开盘价
 *   context.highs    number[]  历史最高价
 *   context.lows     number[]  历史最低价
 *   context.volumes  number[]  历史成交量
 *   context.capital  number    当前可用资金
 *   context.position number    当前持仓股数
 *   context.avgCost  number    持仓均价
 *
 * ── 返回值 ───────────────────────────────
 *   { action: 'buy',  amount: 0~1 }  买入，amount为资金比例
 *   { action: 'sell', amount: 0~1 }  卖出，amount为持仓比例
 *   null                              不操作
 */

function onBar(bar, context) {
  const { closes, capital, position } = context;

  // 计算20日均线
  const period = 20;
  if (closes.length < period) return null;

  const ma = closes.slice(-period).reduce((a, b) => a + b, 0) / period;

  // 价格上穿均线且空仓 → 买入50%资金
  if (bar.close > ma && position === 0) {
    return { action: 'buy', amount: 0.5 };
  }

  // 价格下穿均线且有持仓 → 全部卖出
  if (bar.close < ma && position > 0) {
    return { action: 'sell', amount: 1.0 };
  }

  return null; // 持仓不变
}
