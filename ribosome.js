const Enzyme = require('./enzyme')
const {
    cut,
    del,
    swi,
    mvr,
    mvl,
    cop,
    off,
    ina,
    inc,
    ing,
    int,
    rpy,
    rpu,
    lpy,
    lpu
} = require('./amino acid')
const acid = [
    [null, cut, del, swi],
    [mvr, mvl, cop, off],
    [ina, inc, ing, int],
    [rpy, rpu, lpy, lpu]
]
const acidIndex = "ACGT"
    //直行
function s(cd) {
    return cd
}
//右转
function r(cd) {
    return { u: 'r', d: 'l', l: 'u', r: 'd' }[cd]
}
//左转
function l(cd) {
    return { u: 'l', d: 'r', l: 'd', r: 'u' }[cd]
}
//折叠
function fold(enzyme) {
    if (enzyme.length < 3) return null
    let d = foldMap[enzyme[0].name].name
    if (d === 's') d = 'u'
    let cd = d
    for (let i = 1; i < enzyme.length - 1; i++) {
        cd = foldMap[enzyme[i].name](cd)
    }
    if (d == cd) return 'A'
    if (d == r(cd)) return 'C'
    if (d == l(cd)) return 'G'
    if (d == r(r(cd))) return 'T'
}
const foldMap = {
    cut: s,
    del: s,
    swi: r,
    mvr: s,
    mvl: s,
    cop: r,
    off: l,
    ina: s,
    inc: r,
    ing: r,
    int: l,
    rpy: r,
    rpu: l,
    lpy: l,
    lpu: l
}
module.exports = function(rna) {
    let result = new Enzyme(rna)
    let results = [result]
    for (let i = 0; i < rna.length - 1; i += 2) {
        let amino = acid[acidIndex.indexOf(rna[i])][acidIndex.indexOf(rna[i + 1])]
        if (amino)
            result.build(amino, rna[i], rna[i + 1])
        else if (result.cmd.length) {
            result.like = fold(result.cmd)
            result = new Enzyme(rna)
            results.push(result)
        }
    }
    result.like = fold(result.cmd)
    return results
}