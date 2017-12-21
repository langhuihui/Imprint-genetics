function* trace(from) {
    yield from
    let tmp = from
    while (tmp.from) {
        yield tmp.from
        if (tmp.from[0] && tmp.from[0] instanceof RNA) {
            tmp = tmp.from[0]
        } else
            tmp = tmp.from
    }
}
class RNA extends Array {
    toString() {
        return this.join('')
    }
    trace() {
        return Array.from(trace(this.from))
    }
    static parse(s) {
        let rna = s.split('')
        Object.setPrototypeOf(rna, RNA.prototype)
        return rna
    }
    equal(another) {
        return this.toString() === another.toString()
    }
}
RNA.prototype.age = 0
module.exports = RNA