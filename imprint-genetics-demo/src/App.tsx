import React, { useEffect } from 'react';
import { useGeneticsStore } from './store/genetics-store';
import { ControlPanel } from './components/ControlPanel';
import { RNAVisualization } from './components/RNAVisualization';
import { EnzymeVisualization } from './components/EnzymeVisualization';
import { RibosomeAnimation } from './components/RibosomeAnimation';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';

function App() {
  const { 
    isRunning, 
    isAutoMode, 
    simulationSpeed, 
    step,
    stop 
  } = useGeneticsStore();

  // 自动执行逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && isAutoMode) {
      interval = setInterval(() => {
        step();
      }, simulationSpeed);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isAutoMode, simulationSpeed, step]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="genetics-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* 顶部标题栏 */}
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🧬</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">印符遗传学演示</h1>
                  <p className="text-slate-400 text-sm">基于《GEB》概念的RNA翻译与酶活性仿真</p>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                <span>现代生物学可视化平台</span>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧控制面板 */}
            <div className="lg:col-span-1">
              <ControlPanel />
            </div>

            {/* 右侧可视化区域 */}
            <div className="lg:col-span-3 space-y-8">
              {/* RNA序列可视化 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  RNA序列池
                </h2>
                <RNAVisualization />
              </div>

              {/* 核糖体翻译动画 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  核糖体翻译过程
                </h2>
                <RibosomeAnimation />
              </div>

              {/* 酶活性展示 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  酶活性监控
                </h2>
                <EnzymeVisualization />
              </div>
            </div>
          </div>
        </main>

        {/* 底部信息栏 */}
        <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <div>
                <span>印符遗传学 - 探索RNA自复制的奥秘</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>基于React + TypeScript构建</span>
                <span>•</span>
                <span>现代科学可视化</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;