import { RNA, Base } from './rna';
import { AminoAcid, AminoAcidType, aminoAcids, Direction, turn } from './amino-acid';

export interface EnzymeAction {
  type: AminoAcidType;
  aminoAcid: AminoAcid;
  position: number;
}

export class Enzyme {
  public age: number = 0;
  public actions: EnzymeAction[] = [];
  public like: Base | null = null; // 酶喜欢结合的碱基
  public sourceRNA: RNA;
  public resultRNAs: RNA[] = []; // 酶作用后产生的RNA片段
  public position: number = 0; // 酶在RNA上的位置
  public copyMode: boolean = false; // 是否处于复制模式

  constructor(sourceRNA: RNA) {
    this.sourceRNA = sourceRNA;
  }

  // 添加氨基酸到酶中
  addAminoAcid(type: AminoAcidType, position: number): void {
    const aminoAcid = aminoAcids[type];
    this.actions.push({
      type,
      aminoAcid,
      position
    });
  }

  // 计算酶的三级结构，确定喜欢的碱基
  calculateStructure(): Base | null {
    if (this.actions.length < 3) return null;

    let direction: Direction = 'u'; // 初始方向向上
    const firstTurn = aminoAcids[this.actions[0].type].turn;

    if (firstTurn === 's') direction = 'u';

    // 计算中间的转向
    for (let i = 1; i < this.actions.length - 1; i++) {
      const aminoAcid = aminoAcids[this.actions[i].type];
      direction = turn(direction, aminoAcid.turn);
    }

    // 根据第一段和最后一段的方向确定喜欢的碱基
    const initialDirection = 'u';
    const finalDirection = direction;

    if (initialDirection === 'r' && finalDirection === 'r') return 'A';
    if (initialDirection === 'r' && finalDirection === 'u') return 'C';
    if (initialDirection === 'r' && finalDirection === 'd') return 'G';
    if (initialDirection === 'r' && finalDirection === 'l') return 'U';

    // 默认情况
    return 'A';
  }

  // 执行酶的作用
  execute(targetRNA: RNA): RNA[] {
    this.resultRNAs = [];
    this.position = 0;
    this.copyMode = false;

    // 寻找结合位点
    const bindingSite = this.findBindingSite(targetRNA);
    if (bindingSite === -1) return [];

    this.position = bindingSite;
    let workingRNA = new RNA(targetRNA.toString());

    // 执行每个氨基酸的动作
    for (const action of this.actions) {
      workingRNA = this.executeAction(action, workingRNA);
      if (!workingRNA) break;
    }

    return this.resultRNAs;
  }

  // 寻找结合位点
  private findBindingSite(rna: RNA): number {
    if (!this.like) return -1;

    for (let i = 0; i < rna.length; i++) {
      if (rna[i] === this.like) {
        return i;
      }
    }
    return -1;
  }

  // 执行单个氨基酸动作
  private executeAction(action: EnzymeAction, rna: RNA): RNA | null {
    switch (action.type) {
      case 'cut':
        return this.cut(rna);
      case 'del':
        return this.delete(rna);
      case 'mvr':
        this.moveRight(rna);
        return rna;
      case 'mvl':
        this.moveLeft(rna);
        return rna;
      case 'cop':
        this.copyMode = true;
        return rna;
      case 'off':
        this.copyMode = false;
        return rna;
      case 'ina':
        return this.insert(rna, 'A');
      case 'inc':
        return this.insert(rna, 'C');
      case 'ing':
        return this.insert(rna, 'G');
      case 'int':
        return this.insert(rna, 'U');
      case 'rpy':
        this.findRightPyrimidine(rna);
        return rna;
      case 'rpu':
        this.findRightPurine(rna);
        return rna;
      case 'lpy':
        this.findLeftPyrimidine(rna);
        return rna;
      case 'lpu':
        this.findLeftPurine(rna);
        return rna;
      default:
        return rna;
    }
  }

  private cut(rna: RNA): RNA {
    if (this.position < rna.length) {
      const leftPart = new RNA(rna.slice(0, this.position).join(''));
      const rightPart = new RNA(rna.slice(this.position).join(''));

      if (leftPart.length > 0) {
        leftPart.trace = { from: rna, enzyme: this.toString() };
        this.resultRNAs.push(leftPart);
      }
      if (rightPart.length > 0) {
        rightPart.trace = { from: rna, enzyme: this.toString() };
        this.resultRNAs.push(rightPart);
      }
    }
    return rna;
  }

  private delete(rna: RNA): RNA {
    if (this.position < rna.length) {
      const newSequence = [...rna];
      newSequence.splice(this.position, 1);
      return new RNA(newSequence);
    }
    return rna;
  }

  private moveRight(rna: RNA): void {
    if (this.position < rna.length - 1) {
      this.position++;
    }
  }

  private moveLeft(rna: RNA): void {
    if (this.position > 0) {
      this.position--;
    }
  }

  private insert(rna: RNA, base: Base): RNA {
    const newSequence = [...rna];
    newSequence.splice(this.position + 1, 0, base);
    return new RNA(newSequence);
  }

  private findRightPyrimidine(rna: RNA): void {
    for (let i = this.position + 1; i < rna.length; i++) {
      if (rna[i] === 'C' || rna[i] === 'U') {
        this.position = i;
        break;
      }
    }
  }

  private findRightPurine(rna: RNA): void {
    for (let i = this.position + 1; i < rna.length; i++) {
      if (rna[i] === 'A' || rna[i] === 'G') {
        this.position = i;
        break;
      }
    }
  }

  private findLeftPyrimidine(rna: RNA): void {
    for (let i = this.position - 1; i >= 0; i--) {
      if (rna[i] === 'C' || rna[i] === 'U') {
        this.position = i;
        break;
      }
    }
  }

  private findLeftPurine(rna: RNA): void {
    for (let i = this.position - 1; i >= 0; i--) {
      if (rna[i] === 'A' || rna[i] === 'G') {
        this.position = i;
        break;
      }
    }
  }

  toString(): string {
    return this.actions.map(action => action.aminoAcid.name).join('-');
  }

  getDescription(): string {
    return this.actions.map(action =>
      `${action.aminoAcid.name}(${action.aminoAcid.description})`
    ).join(' → ');
  }
}