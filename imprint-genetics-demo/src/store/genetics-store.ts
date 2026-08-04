import { create } from 'zustand';
import { RNA } from '../models/rna';
import { Enzyme } from '../models/enzyme';
import { Ribosome } from '../models/ribosome';

export interface GeneticsState {
  // RNA序列数据
  rnaSequences: RNA[];
  enzymes: Enzyme[];

  // 仿真参数
  maxRNAAge: number;
  maxEnzymeAge: number;
  isAutoMode: boolean;
  simulationSpeed: number;

  // 当前状态
  currentStep: number;
  isRunning: boolean;

  // 初始RNA
  initialRNA: string;

  // 动作
  setInitialRNA: (sequence: string) => void;
  generateRandomRNA: () => void;
  addRNA: (rna: RNA) => void;
  addEnzyme: (enzyme: Enzyme) => void;
  removeRNA: (index: number) => void;
  removeEnzyme: (index: number) => void;

  // 仿真控制
  step: () => void;
  start: () => void;
  stop: () => void;
  reset: () => void;

  // 参数设置
  setMaxRNAAge: (age: number) => void;
  setMaxEnzymeAge: (age: number) => void;
  setAutoMode: (auto: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
}

export const useGeneticsStore = create<GeneticsState>((set, get) => ({
  // 初始状态
  rnaSequences: [],
  enzymes: [],
  maxRNAAge: 3,
  maxEnzymeAge: 3,
  isAutoMode: false,
  simulationSpeed: 1000,
  currentStep: 0,
  isRunning: false,
  initialRNA: '',

  // RNA操作
  setInitialRNA: (sequence: string) => {
    set({ initialRNA: sequence });
  },

  generateRandomRNA: () => {
    const length = Math.floor(Math.random() * 50) + 20;
    const rna = RNA.random(length);
    set({ initialRNA: rna.toString() });
  },

  addRNA: (rna: RNA) => {
    set(state => ({
      rnaSequences: [...state.rnaSequences, rna]
    }));
  },

  addEnzyme: (enzyme: Enzyme) => {
    set(state => ({
      enzymes: [...state.enzymes, enzyme]
    }));
  },

  removeRNA: (index: number) => {
    set(state => ({
      rnaSequences: state.rnaSequences.filter((_, i) => i !== index)
    }));
  },

  removeEnzyme: (index: number) => {
    set(state => ({
      enzymes: state.enzymes.filter((_, i) => i !== index)
    }));
  },

  // 仿真步骤
  step: () => {
    const state = get();

    if (state.rnaSequences.length === 0 && state.initialRNA) {
      const initialRNA = RNA.parse(state.initialRNA);
      state.addRNA(initialRNA);

      const newEnzymes = Ribosome.translate(initialRNA);
      newEnzymes.forEach(enzyme => state.addEnzyme(enzyme));

      set({ currentStep: state.currentStep + 1 });
      return;
    }

    if (state.enzymes.length > 0 && state.rnaSequences.length > 0) {
      const randomRNAIndex = Math.floor(Math.random() * state.rnaSequences.length);
      const randomEnzymeIndex = Math.floor(Math.random() * state.enzymes.length);

      const targetRNA = state.rnaSequences[randomRNAIndex];
      const enzyme = state.enzymes[randomEnzymeIndex];

      const resultRNAs = enzyme.execute(targetRNA);
      resultRNAs.forEach(rna => state.addRNA(rna));

      // 增加年龄
      targetRNA.age++;
      enzyme.age++;

      // 移除过老的RNA和酶
      if (targetRNA.age > state.maxRNAAge) {
        state.removeRNA(randomRNAIndex);
      }
      if (enzyme.age > state.maxEnzymeAge) {
        state.removeEnzyme(randomEnzymeIndex);
      }

      set({ currentStep: state.currentStep + 1 });
    }
  },

  start: () => {
    set({ isRunning: true });
  },

  stop: () => {
    set({ isRunning: false });
  },

  reset: () => {
    set({
      rnaSequences: [],
      enzymes: [],
      currentStep: 0,
      isRunning: false
    });
  },

  setMaxRNAAge: (age: number) => {
    set({ maxRNAAge: age });
  },

  setMaxEnzymeAge: (age: number) => {
    set({ maxEnzymeAge: age });
  },

  setAutoMode: (auto: boolean) => {
    set({ isAutoMode: auto });
  },

  setSimulationSpeed: (speed: number) => {
    set({ simulationSpeed: speed });
  }
}));