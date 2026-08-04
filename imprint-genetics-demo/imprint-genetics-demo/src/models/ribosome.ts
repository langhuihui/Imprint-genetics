import { RNA } from './rna';
import { Enzyme } from './enzyme';
import { translationTable, AminoAcidType } from './amino-acid';

export class Ribosome {
  // 将RNA翻译成酶
  static translate(rna: RNA): Enzyme[] {
    rna.translated = true;
    const enzymes: Enzyme[] = [];
    let currentEnzyme = new Enzyme(rna);

    const dipeptides = rna.getDipeptides();

    for (let i = 0; i < dipeptides.length; i++) {
      const dipeptide = dipeptides[i];
      const aminoAcidType = translationTable[dipeptide];

      if (aminoAcidType) {
        currentEnzyme.addAminoAcid(aminoAcidType, i * 2);
      } else {
        // 遇到终止密码子，结束当前酶的构建
        if (currentEnzyme.actions.length > 0) {
          currentEnzyme.like = currentEnzyme.calculateStructure();
          if (currentEnzyme.like) {
            enzymes.push(currentEnzyme);
          }
          currentEnzyme = new Enzyme(rna);
        }
      }
    }

    // 处理最后一个酶
    if (currentEnzyme.actions.length > 0) {
      currentEnzyme.like = currentEnzyme.calculateStructure();
      if (currentEnzyme.like) {
        enzymes.push(currentEnzyme);
      }
    }

    return enzymes;
  }

  // 获取翻译过程的详细步骤（用于动画展示）
  static getTranslationSteps(rna: RNA): TranslationStep[] {
    const steps: TranslationStep[] = [];
    const dipeptides = rna.getDipeptides();

    for (let i = 0; i < dipeptides.length; i++) {
      const dipeptide = dipeptides[i];
      const aminoAcidType = translationTable[dipeptide];

      steps.push({
        position: i * 2,
        dipeptide,
        aminoAcidType,
        isTerminator: !aminoAcidType
      });
    }

    return steps;
  }
}

export interface TranslationStep {
  position: number;
  dipeptide: string;
  aminoAcidType: AminoAcidType | null;
  isTerminator: boolean;
}