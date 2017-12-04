function* trace(from) {
    yield from
    let tmp = from
    while (tmp.from) {
        yield tmp.from
        tmp = tmp.from[0] || tmp.from
    }
}
class RNA extends Array {
    toString() {
        return this.join('')
    }
    trace() {
        return Array.from(trace(this.from))
    }
    static parse() {
        let rna = s.split('')
        Object.setPrototypeOf(rna, RNA.prototype)
        return rna
    }
}
module.exports = RNA