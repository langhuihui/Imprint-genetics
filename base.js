/**
 * 碱基
 */
class Base {

}
const copyMap = {
    A: 'T',
    T: 'A',
    G: 'C',
    C: 'G'
}

function copyOne(b) {
    return copyMap[b]
}


const pyrimidine = new Set(['T', 'C'])
const purine = new Set(['A', 'G'])
module.exports = {
    copy(...base) {
        return base.map(copyOne)
    },
    copyOne,
    isPyrimidine(b) {
        if (!b) throw new Error()
        return pyrimidine.has(b)
    },
    isPurine(b) {
        if (!b) throw new Error()
        return purine.has(b)
    }
}