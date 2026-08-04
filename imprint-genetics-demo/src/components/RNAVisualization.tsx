import React from 'react';
import { useGeneticsStore } from '../store/genetics-store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function RNAVisualization() {
  const { rnaSequences, removeRNA } = useGeneticsStore();

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'bg-red-500 text-white';
      case 'U': return 'bg-blue-500 text-white';
      case 'G': return 'bg-green-500 text-white';
      case 'C': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAgeColor = (age: number, maxAge: number) => {
    const ratio = age / maxAge;
    if (ratio < 0.3) return 'text-green-400';
    if (ratio < 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (rnaSequences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
          <span className="text-2xl">🧬</span>
        </div>
        <p className="text-slate-400 mb-2">暂无RNA序列</p>
        <p className="text-slate-500 text-sm">请输入初始RNA序列并开始仿真</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rnaSequences.map((rna, index) => (
        <Card key={index} className="bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/50">
                  RNA #{index + 1}
                </Badge>
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-3 h-3" />
                  <span className={getAgeColor(rna.age, 3)}>
                    年龄: {rna.age}
                  </span>
                </div>
                {rna.translated && (
                  <Badge variant="secondary" className="text-xs">
                    已翻译
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRNA(index)}
                className="text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* RNA序列可视化 */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {rna.map((base, baseIndex) => (
                  <div
                    key={baseIndex}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBaseColor(base)} shadow-lg`}
                    title={`位置 ${baseIndex + 1}: ${base}`}
                  >
                    {base}
                  </div>
                ))}
              </div>
            </div>

            {/* 序列信息 */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center space-x-4">
                <span>长度: {rna.length}</span>
                <span>序列: {rna.toString()}</span>
              </div>
              {rna.trace.enzyme && (
                <div className="text-xs">
                  <span className="text-slate-500">来源酶: </span>
                  <span className="text-orange-400">{rna.trace.enzyme}</span>
                </div>
              )}
            </div>

            {/* 碱基统计 */}
            <div className="mt-3 pt-3 border-t border-slate-600/50">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-400">A: {rna.filter(b => b === 'A').length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-400">U: {rna.filter(b => b === 'U').length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-400">G: {rna.filter(b => b === 'G').length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-400">C: {rna.filter(b => b === 'C').length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}