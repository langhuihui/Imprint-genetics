import React from 'react';
import { useGeneticsStore } from '../store/genetics-store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trash2, Clock, Zap, Target } from 'lucide-react';

export function EnzymeVisualization() {
  const { enzymes, removeEnzyme } = useGeneticsStore();

  const getAgeColor = (age: number, maxAge: number) => {
    const ratio = age / maxAge;
    if (ratio < 0.3) return 'text-green-400';
    if (ratio < 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'bg-red-500 text-white';
      case 'U': return 'bg-blue-500 text-white';
      case 'G': return 'bg-green-500 text-white';
      case 'C': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'cut': return 'bg-red-600 text-white';
      case 'del': return 'bg-red-500 text-white';
      case 'mvr': case 'mvl': return 'bg-blue-600 text-white';
      case 'cop': case 'off': return 'bg-purple-600 text-white';
      case 'ina': case 'inc': case 'ing': case 'int': return 'bg-green-600 text-white';
      case 'rpy': case 'rpu': case 'lpy': case 'lpu': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (enzymes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
          <Zap className="w-8 h-8 text-orange-400" />
        </div>
        <p className="text-slate-400 mb-2">暂无活性酶</p>
        <p className="text-slate-500 text-sm">RNA翻译后将产生具有催化活性的酶</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enzymes.map((enzyme, index) => (
        <Card key={index} className="bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                  酶 #{index + 1}
                </Badge>
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-3 h-3" />
                  <span className={getAgeColor(enzyme.age, 3)}>
                    年龄: {enzyme.age}
                  </span>
                </div>
                {enzyme.like && (
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">偏好:</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getBaseColor(enzyme.like)}`}>
                      {enzyme.like}
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEnzyme(index)}
                className="text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* 酶的氨基酸序列 */}
            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-2">氨基酸序列:</div>
              <div className="flex flex-wrap gap-1">
                {enzyme.actions.map((action, actionIndex) => (
                  <div
                    key={actionIndex}
                    className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(action.type)}`}
                    title={action.aminoAcid.description}
                  >
                    {action.aminoAcid.name}
                  </div>
                ))}
              </div>
            </div>

            {/* 酶的功能描述 */}
            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-1">功能描述:</div>
              <div className="text-sm text-slate-300 bg-slate-800/50 rounded p-2">
                {enzyme.getDescription() || '暂无功能描述'}
              </div>
            </div>

            {/* 酶的来源信息 */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center space-x-4">
                <span>氨基酸数: {enzyme.actions.length}</span>
                <span>来源RNA: {enzyme.sourceRNA.toString().substring(0, 20)}...</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-500">当前位置: </span>
                <span className="text-blue-400">{enzyme.position}</span>
              </div>
            </div>

            {/* 酶的活性状态 */}
            <div className="mt-3 pt-3 border-t border-slate-600/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${enzyme.copyMode ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                    <span className="text-slate-400">
                      复制模式: {enzyme.copyMode ? '开启' : '关闭'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${enzyme.resultRNAs.length > 0 ? 'bg-blue-400' : 'bg-slate-500'}`}></div>
                    <span className="text-slate-400">
                      产物RNA: {enzyme.resultRNAs.length}
                    </span>
                  </div>
                </div>
                <div className="text-slate-500">
                  ID: {enzyme.toString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}