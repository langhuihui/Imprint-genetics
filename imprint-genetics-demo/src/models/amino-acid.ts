export type AminoAcidType =
  | 'cut' | 'del' | 'swi' | 'mvr' | 'mvl'
  | 'cop' | 'off' | 'ina' | 'inc' | 'ing'
  | 'int' | 'rpy' | 'rpu' | 'lpy' | 'lpu';

export type Direction = 'u' | 'd' | 'l' | 'r';
export type Turn = 's' | 'l' | 'r';

export interface AminoAcid {
  type: AminoAcidType;
  name: string;
  description: string;
  turn: Turn;
}

// 氨基酸定义
export const aminoAcids: Record<AminoAcidType, AminoAcid> = {
  cut: { type: 'cut', name: '切断', description: '切断RNA串', turn: 's' },
  del: { type: 'del', name: '删除', description: '从串里删除一个碱基', turn: 's' },
  swi: { type: 'swi', name: '转移', description: '把酶转移到另一个串上', turn: 'r' },
  mvr: { type: 'mvr', name: '右移', description: '右移一个单元', turn: 's' },
  mvl: { type: 'mvl', name: '左移', description: '左移一个单元', turn: 's' },
  cop: { type: 'cop', name: '复制', description: '进入复制状态', turn: 'r' },
  off: { type: 'off', name: '关闭', description: '退出复制状态', turn: 'l' },
  ina: { type: 'ina', name: '插入A', description: '在本单元右侧插入A', turn: 's' },
  inc: { type: 'inc', name: '插入C', description: '在本单元右侧插入C', turn: 'r' },
  ing: { type: 'ing', name: '插入G', description: '在本单元右侧插入G', turn: 'r' },
  int: { type: 'int', name: '插入T', description: '在本单元右侧插入T', turn: 'l' },
  rpy: { type: 'rpy', name: '右嘧啶', description: '寻找右边最近的嘧啶', turn: 'r' },
  rpu: { type: 'rpu', name: '右嘌呤', description: '寻找右边最近的嘌呤', turn: 'l' },
  lpy: { type: 'lpy', name: '左嘧啶', description: '寻找左边最近的嘧啶', turn: 'l' },
  lpu: { type: 'lpu', name: '左嘌呤', description: '寻找左边最近的嘌呤', turn: 'l' }
};

// 翻译表：RNA二联体 -> 氨基酸
export const translationTable: Record<string, AminoAcidType | null> = {
  'AA': null, 'AC': 'cut', 'AG': 'del', 'AU': 'swi',
  'CA': 'mvr', 'CC': 'mvl', 'CG': 'cop', 'CU': 'off',
  'GA': 'ina', 'GC': 'inc', 'GG': 'ing', 'GU': 'int',
  'UA': 'rpy', 'UC': 'rpu', 'UG': 'lpy', 'UU': 'lpu'
};

// 方向转换函数
export function turn(currentDirection: Direction, turnType: Turn): Direction {
  if (turnType === 's') return currentDirection;

  const turnMap: Record<Turn, Record<Direction, Direction>> = {
    's': { u: 'u', d: 'd', l: 'l', r: 'r' },
    r: { u: 'r', d: 'l', l: 'u', r: 'd' },
    l: { u: 'l', d: 'r', l: 'd', r: 'u' }
  };

  return turnMap[turnType][currentDirection];
}