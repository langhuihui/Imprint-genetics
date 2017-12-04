const RNA = require('./RNA')
class Enzyme {
    constructor(parent) {
        this.gene = new RNA()
        this.gene.from = parent
        this.cmd = []
        this.copying = false
        this.ss = new Set()
    }
    build(cmd, g1, g2) {
        this.cmd.push(cmd)
        this.gene.push(g1, g2)
    }
    exec(s) {
        this.origin = s
        let originStr = s.toString()
        this.s = RNA.parse(originStr)
        this.p = s.findIndex(d => d == this.like)
        for (let x of this.cmd) {
            if (this.s) x.call(this)
            else break
        }
        this.quit()
    }
    quit() {
        if (this.s) {
            this.ss.add(this.s)
            this.s = null
        }
        if (this.s1) {
            this.ss.add(this.s1)
            this.s1 = null
        }
        this.ss.forEach(s => {
            Object.setPrototypeOf(s, RNA.prototype)
            s.from = [this.origin, this]
        })
        this.copying = false
    }
    toString() {
        return this.gene.toString()
    }
}
module.exports = Enzyme