const RNA = require('./RNA')
class Enzyme {
    constructor(parent) {
        this.gene = new RNA()
        this.gene.from = parent
        this.cmd = []
        this.copying = false
        this.ss = []
        this.age = 0
    }
    produce(s) {
        if (s && s.length) {
            this.ss.push(s)
        }
    }
    remove(s) {
        let index = this.ss.indexOf(s)
        if (index != -1)
            this.ss.splice(index, 1)
    }
    build(cmd, g1, g2) {
        this.cmd.push(cmd)
        this.gene.push(g1, g2)
    }
    exec(s) {
        this.age++;
        this.origin = s
        this.origin.age++;
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
            this.produce(this.s)
            this.s = null
        }
        if (this.s1) {
            this.produce(this.s1)
            this.s1 = null
        }
        let remove = []
        this.ss.forEach(s => {
            Object.setPrototypeOf(s, RNA.prototype)
            s.from = [this.origin, this]
            if (this.origin.equal(s)) {
                remove.push(s)
            }
            if (s.length < 4) {
                remove.push(s)
            }
        })
        while (remove.length) {
            this.ss.splice(this.ss.indexOf(remove.pop()), 1)
        }
        this.copying = false
    }
    toString() {
        return this.gene.toString()
    }
}
module.exports = Enzyme