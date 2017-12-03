class Enzyme {
    constructor(gene) {
        this.gene = gene
        this.copying = false
        this.ss = new Set()
    }
    exec(s) {
        this.s = s
        this.ss.add(s)
        this.p = s.findIndex(d => d == this.like)
        for (let x of this.gene) {
            if (this.s) x.call(this)
            else break
        }
        this.quit()
    }
    quit() {
        this.s = null
        this.s1 = null
        this.copying = false
    }
    toString() {
        return this.gene.map(x => x.name).join('')
    }
}
module.exports = Enzyme