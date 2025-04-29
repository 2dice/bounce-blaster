#!/usr/bin/env node

import * as fs from 'fs';

function mdRangeMap(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const headings = [];
  
  // コードブロック内かどうかを追跡するフラグ
  let insideCodeBlock = false;

  lines.forEach((line, idx) => {
    // コードブロックの開始/終了を検出
    if (line.trim().match(/^```/)) {
      insideCodeBlock = !insideCodeBlock;
      return;
    }
    
    // コードブロック内ではない場合のみ見出しを検出
    if (!insideCodeBlock) {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        headings.push({
          level: match[1].length,
          title: match[2].trim(),
          raw: match[0].trim(),
          lineIndex: idx  // 0-indexedの行番号を直接保存
        });
      }
    }
  });

  const totalLines = lines.length;
  headings.forEach((h, i) => {
    // 開始行は見出しの行自体
    h.start = h.lineIndex;
    
    // 終了行の計算
    let end = totalLines - 1; // 0-indexedでファイルの最後の行
    
    // 次の見出しを探す（同じかより高いレベルの見出し）
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= h.level) {
        end = headings[j].lineIndex - 1; // 次の見出しの直前まで
        break;
      }
    }
    
    h.end = end;
  });

  // 番号付け
  const counters = Array(7).fill(0);
  headings.forEach(h => {
    counters[h.level] += 1;
    for (let l = h.level + 1; l < counters.length; l++) counters[l] = 0;
    h.number = counters.slice(1, h.level + 1).join('.');
  });

  // write TOC to output file
  const outputLines = [];
  outputLines.push(`File: ${filePath}`);
  headings.forEach(h => {
    outputLines.push(`${h.raw} (StartLine=${h.start}, EndLine=${h.end})`);
  });
  const outPath = filePath.replace(/\.md$/, '_toc.md');
  fs.writeFileSync(outPath, outputLines.join('\n'), 'utf-8');
  console.log(`Wrote TOC to ${outPath}`);
}

// メイン処理をすぐに実行
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node md-range-map.js <file1.md> [file2.md ...]');
  process.exit(1);
}
args.forEach(mdRangeMap);
