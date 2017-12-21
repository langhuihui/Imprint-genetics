<template lang="pug">
    div
        Input(v-model="firstRNA")
           span(slot="prepend") 初始RNA序列
           Button(slot="append" @click="createFirstRNA") 随机生成
        Row
            Button(@click="step") 单步执行
            |自动执行
            i-switch(v-model="auto")
            InputNumber(v-model="ssMaxage")
            InputNumber(v-model="enMaxage")
        Table(:columns="ssColumns" :data="ssData")
        Table(:columns="enzymeColumns" :data="enzymes")
</template>

<script>
const ribosome = require("../ribosome");
const RNA = require("../RNA");
const RNAs = [];
const Enzymes = [];
export default {
  data() {
    return {
      firstRNA: "",
      ssColumns: [
        { title: "RNA序列", key: "s" },
        { title: "由该酶产生", key: "enzyme" }
      ],
      enzymeColumns: [
        { title: "酶", key: "s" },
        {title:"喜好",key:"like"},
        { title: "该酶由RNA翻译得到", key: "rna" }
      ],
      auto: false,
      enzymes: [],
      ssData: [],
      ssMaxage:3,
      enMaxage:3
    };
  },
  methods: {
    createFirstRNA() {
      let len = (Math.random() * 100) >> 0;
      let array = new Array(len);
      for (let i = 0; i < len; i++)
        array[i] = ["A", "T", "G", "C"][(Math.random() * 4) >> 0];
      this.firstRNA = array.join("");
    },
    step() {
      let enzymes = [];
      let fromRNA = null;
      if (this.enzymes.length == 0) {
        fromRNA = RNA.parse(this.firstRNA);
        this.ssData.push({ s: this.firstRNA, enzyme: "无" });
        RNAs.push(fromRNA);
        enzymes = ribosome(fromRNA).filter(e => e.like);
      } else {
        let ssIndex = (Math.random() * this.ssData.length) >> 0;
        let randSS = this.ssData[ssIndex];
        fromRNA = RNAs[ssIndex];
        if(!fromRNA.translated)
            enzymes = ribosome(fromRNA).filter(e => e.like);
        else{

        }
      }
      this.enzymes.push(
        ...enzymes.map(enzyme => {
          Enzymes.push(enzyme);
          return { s: enzyme.toString(),like:enzyme.like, rna: fromRNA.toString() };
        })
      );
      if (this.enzymes.length) {
        let ssIndex = (Math.random() * this.ssData.length) >> 0;
        let enzymeIndex = (Math.random() * this.enzymes.length) >> 0;
        let randSS = RNAs[ssIndex];
        let randEnzyme = Enzymes[enzymeIndex];
        randEnzyme.exec(randSS);
        this.ssData.push(
          ...randEnzyme.ss.map(s => {
              console.log(s)
            RNAs.push(s);
            return {
              s:s.toString(),
              enzyme: randEnzyme.toString()
            };
          })
        );
        randEnzyme.ss.length=0;
        if (randSS.age > this.ssMaxage) {
          this.ssData.splice(ssIndex, 1);
          RNAs.splice(ssIndex,1)
        }
        if (randEnzyme.age > this.enMaxage) {
          this.enzymes.splice(enzymeIndex, 1);
          Enzymes.splice(enzymeIndex,1)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>