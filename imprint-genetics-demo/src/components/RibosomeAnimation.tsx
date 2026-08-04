import React, { useState, useEffect } from 'react';
import { useGeneticsStore } from '../store/genetics-store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Ribosome, TranslationStep } from '../models/ribosome';
import { RNA } from '../models/rna';

export function RibosomeAnimation() {
  const { rnaSequences, addEnzyme } = useGeneticsStore();
  const [selectedRNA, setSelectedRNA] = useState<RNA | null>(null);
  const [translationSteps, setTranslationSteps] = useState<TranslationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 选择第一个未翻译的RNA
  useEffect(() => {
    const unTranslatedRNA = rnaSequences.find(rna => !rna.translated);
    if (unTranslatedRNA && unTranslatedRNA !== selectedRNA) {
      setSelectedRNA(unTranslatedRNA);
      setTranslationSteps(Ribosome.getTranslationSteps(unTranslatedRNA));
      setCurrentStep(0);
    }
  }, [rnaSequences, selectedRNA]);

  const startAnimation = () => {
    if (!selectedRNA) return;
    setIsAnimating(true);
    setCurrentStep(0);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const completeTranslation = () => {
    if (!selectedRNA) return;
    
    const enzymes = Ribosome.translate(selectedRNA);
    enzymes.forEach(enzyme => addEnzyme(enzyme));
    
    setIsAnimating(false);
    setCurrentStep(0);
  };

  // 动画逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnimating && currentStep < translationSteps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= translationSteps.length - 1) {
            setIsAnimating(false);
            completeTranslation();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnimating, currentStep, translationSteps.length]);

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'bg-red-500 text-white';
      case 'U': return 'bg-blue-500 text-white';
      case 'G': return 'bg-green-500 text-white';
      case 'C': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAminoAcidColor = (type: string) => {
    switch (type) {
      case 'cut': return 'bg-red-600 text-white';
      case 'del': return 'bg-red-500 text-white';
      case 'mvr': case 'mvl': return 'bg-blue-600 text-white';
      case 'cop': case 'off': return 'bg-purple-600 text-white';
      case 'ina': case 'inc': case 'ing': case 'int': return 'bg-green-600 text-white';
      case 'rpy': case 'rpu': case 'lpy': case 'lpu': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!selectedRNA) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
          <span className="text-2xl">🏭</span>
        </div>
        <p className="text-slate-400 mb-2">暂无可翻译的RNA</p>
        <p className="text-slate-500 text-sm">添加RNA序列后将显示翻译过程</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400/50">
            翻译中: {selectedRNA.toString().substring(0, 20)}...
          </Badge>
          <span className="text-sm text-slate-400">
            步骤 {currentStep + 1} / {translationSteps.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={isAnimating ? stopAnimation : startAnimation}
            variant={isAnimating ? "destructive" : "default"}
            size="sm"
          >
            {isAnimating ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                暂停
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                开始翻译
              </>
            )}
          </Button>
          <Button onClick={resetAnimation} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* RNA序列显示 */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-white mb-2">RNA模板链</h3>
            <div className="flex flex-wrap gap-1">
              {selectedRNA.map((base, index) => {
                const isCurrentPosition = Math.floor(index / 2) === currentStep;
                const isPastPosition = Math.floor(index / 2) < currentStep;
                
                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      getBaseColor(base)
                    } ${
                      isCurrentPosition 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-700 scale-110' 
                        : isPastPosition 
                        ? 'opacity-50' 
                        : ''
                    }`}
                  >
                    {base}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 当前翻译的二联体 */}
          {translationSteps[currentStep] && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-400">当前二联体:</div>
                  <div className="flex space-x-1">
                    {translationSteps[currentStep].dipeptide.split('').map((base, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getBaseColor(base)}`}
                      >
                        {base}
                      </div>
                    ))}
                  </div>
                  <div className="text-lg text-slate-300">→</div>
                  {translationSteps[currentStep].aminoAcidType ? (
                    <div className={`px-3 py-1 rounded text-sm font-medium ${getAminoAcidColor(translationSteps[currentStep].aminoAcidType!)}`}>
                      {translationSteps[currentStep].aminoAcidType}
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded text-sm font-medium bg-gray-600 text-white">
                      终止密码子
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 翻译进度 */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-white mb-3">翻译进度</h3>
          <div className="space-y-2">
            {translationSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : index < currentStep 
                    ? 'bg-green-600/10' 
                    : 'bg-slate-800/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-slate-400 w-8">#{index + 1}</div>
                  <div className="flex space-x-1">
                    {step.dipeptide.split('').map((base, baseIndex) => (
                      <div
                        key={baseIndex}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getBaseColor(base)}`}
                      >
                        {base}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.aminoAcidType ? (
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getAminoAcidColor(step.aminoAcidType)}`}>
                      {step.aminoAcidType}
                    </div>
                  ) : (
                    <div className="px-2 py-1 rounded text-xs font-medium bg-gray-600 text-white">
                      STOP
                    </div>
                  )}
                  {index <= currentStep && (
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}