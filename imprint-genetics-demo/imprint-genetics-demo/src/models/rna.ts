export type Base = 'A' | 'U' | 'G' | 'C';

export interface RNATrace {
  from?: RNA | RNA[];
  enzyme?: string;
}

export class RNA extends Array<Base> {
  public age: number = 0;
  public translated: boolean = false;
  public trace: RNATrace = {};

  constructor(sequence?: string | Base[]) {
    super();
    if (sequence) {
      if (typeof sequence === 'string') {
        const bases = sequence.split('') as Base[];
        for (const base of bases) {
          this.push(base);
        }
      } else if (Array.isArray(sequence)) {
        for (const base of sequence) {
          this.push(base);
        }
      }
    }
  }

  toString(): string {
    return this.join('');
  }

  static parse(sequence: string): RNA {
    return new RNA(sequence);
  }

  static random(length: number): RNA {
    const bases: Base[] = ['A', 'U', 'G', 'C'];
    const sequence = Array.from({ length }, () =>
      bases[Math.floor(Math.random() * bases.length)]
    );
    return new RNA(sequence);
  }

  equal(other: RNA): boolean {
    return this.toString() === other.toString();
  }

  getComplement(): RNA {
    const complementMap: Record<Base, Base> = {
      'A': 'U',
      'U': 'A',
      'G': 'C',
      'C': 'G'
    };

    const complement = Array.from(this).map(base => complementMap[base]);
    return new RNA(complement);
  }

  // 获取密码子（三联体）
  getCodons(): string[] {
    const codons: string[] = [];
    for (let i = 0; i < this.length - 2; i += 3) {
      const codon = Array.from(this.slice(i, i + 3)).join('');
      codons.push(codon);
    }
    return codons;
  }

  // 获取二联体（用于翻译成氨基酸）
  getDipeptides(): string[] {
    const dipeptides: string[] = [];
    for (let i = 0; i < this.length - 1; i += 2) {
      dipeptides.push(this.slice(i, i + 2).join(''));
    }
    return dipeptides;
  }
}