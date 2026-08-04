import React from 'react';
import { useGeneticsStore } from '../store/genetics-store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';

export function ControlPanel() {
  const {
    initialRNA,
    isRunning,
    isAutoMode,
    maxRNAAge,
    maxEnzymeAge,
    simulationSpeed,
    currentStep,
    setInitialRNA,
    generateRandomRNA,
    start,
    stop,
    step,
    reset,
    setAutoMode,
    setMaxRNAAge,
    setMaxEnzymeAge,
    setSimulationSpeed
  } = useGeneticsStore();

  const handleSpeedChange = (value: number[]) => {
    setSimulationSpeed(2000 - value[0]); // 反转滑块值，使右侧为更快
  };

  return (
    <div className="space-y-6">
      {/* 仿真控制 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
            仿真控制
          </CardTitle>
          <CardDescription>
            控制RNA翻译和酶活性仿真过程
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 执行控制按钮 */}
          <div className="flex gap-2">
            <Button
              onClick={isRunning ? stop : start}
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  开始
                </>
              )}
            </Button>
            <Button onClick={step} variant="outline" size="sm">
              <SkipForward className="w-4 h-4 mr-2" />
              单步
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* 自动模式开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-mode" className="text-slate-300">
              自动执行
            </Label>
            <Switch
              id="auto-mode"
              checked={isAutoMode}
              onCheckedChange={setAutoMode}
            />
          </div>

          {/* 执行速度 */}
          <div className="space-y-2">
            <Label className="text-slate-300">执行速度</Label>
            <Slider
              value={[2000 - simulationSpeed]}
              onValueChange={handleSpeedChange}
              max={1800}
              min={200}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>慢</span>
              <span>快</span>
            </div>
          </div>

          {/* 当前步数 */}
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{currentStep}</div>
            <div className="text-xs text-slate-400">执行步数</div>
          </div>
        </CardContent>
      </Card>

      {/* RNA序列设置 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
            RNA序列设置
          </CardTitle>
          <CardDescription>
            配置初始RNA序列
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rna-sequence" className="text-slate-300">
              初始RNA序列
            </Label>
            <Input
              id="rna-sequence"
              value={initialRNA}
              onChange={(e) => setInitialRNA(e.target.value)}
              placeholder="输入RNA序列 (A, U, G, C)"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Button
            onClick={generateRandomRNA}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            随机生成
          </Button>
        </CardContent>
      </Card>

      {/* 生命周期参数 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
            生命周期参数
          </CardTitle>
          <CardDescription>
            调整RNA和酶的最大存活时间
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* RNA最大年龄 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-slate-300">RNA最大年龄</Label>
              <span className="text-sm text-slate-400">{maxRNAAge}</span>
            </div>
            <Slider
              value={[maxRNAAge]}
              onValueChange={(value) => setMaxRNAAge(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <Separator className="bg-slate-700" />

          {/* 酶最大年龄 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-slate-300">酶最大年龄</Label>
              <span className="text-sm text-slate-400">{maxEnzymeAge}</span>
            </div>
            <Slider
              value={[maxEnzymeAge]}
              onValueChange={(value) => setMaxEnzymeAge(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* 系统状态 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
            系统状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">运行状态</span>
              <span className={`font-medium ${isRunning ? 'text-green-400' : 'text-slate-400'}`}>
                {isRunning ? '运行中' : '已停止'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">执行模式</span>
              <span className="text-white font-medium">
                {isAutoMode ? '自动' : '手动'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">速度设置</span>
              <span className="text-white font-medium">
                {Math.round((2000 - simulationSpeed) / 18)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}