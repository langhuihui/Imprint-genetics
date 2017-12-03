/**
 * 氨基酸
 */
const base = require('./base')
const Enzyme = require('./enzyme')

function insert(b) {
    return function() {
        this.s.splice(++this.p, 0, b)
        if (this.copying) {
            this.s1.splice(this.p1++, 0, base.copyOne(b))
        }
    }
}

function cut() {
    let s = this.s
    this.s = s.slice(0, this.p + 1)
    this.ss.add(this.s)
    this.ss.add(s.slice(this.p + 1))
    this.ss.delete(s)
    let s1 = this.s1
    if (s1) { //剪切补串
        if (this.p1 > 0 && this.p1 < s1.length) {
            this.s1 = s1.slice(this.p1)
            this.ss.add(s1.slice(0, this.p1))
            this.ss.add(this.s1)
            this.ss.delete(s1)
            this.p1 = 0
        }
    }
}

function del() {
    this.s.splice(this.p, 1)
}

function swi() {
    let s = this.s
    let p = this.p
    this.s = this.s1
    this.p = this.p1
    this.s1 = s
    this.p1 = p
    if (!this.s || this.p < 0 || this.p > this.s.length) {
        this.quit()
    }
}

function mvr() {
    this.p++;
    if (this.copying) {
        this.s1[--this.p1] = base.copyOne(this.s[this.p])
    }
}

function mvl() {
    this.p--;
    if (this.copying) {
        this.s1[++this.p1] = base.copyOne(this.s[this.p])
    }
}

function cop() {
    if (!this.s1) {
        this.s1 = base.copy(this.s[this.p])
        this.p1 = 0
    }
    this.copying = true
}

function off() {
    this.copying = false
    if (this.s1) {
        this.ss.add(this.s1)
        this.s1 = null
    }
}

function ina() {
    this.s.splice(++this.p, 0, 'A')
    if (this.copying) {
        this.s1.splice(this.p1++, 0, base.copyOne('A'))
    }
}

function inc() {
    this.s.splice(++this.p, 0, 'C')
    if (this.copying) {
        this.s1.splice(this.p1++, 0, base.copyOne('C'))
    }
}

function ing() {
    this.s.splice(++this.p, 0, 'G')
    if (this.copying) {
        this.s1.splice(this.p1++, 0, base.copyOne('G'))
    }
}

function int() {
    this.s.splice(++this.p, 0, 'T')
    if (this.copying) {
        this.s1.splice(this.p1++, 0, base.copyOne('T'))
    }
}

function rpy() {
    for (let b = this.s[++this.p]; b; b = this.s[++this.p]) {
        if (this.copying) {
            this.s1[--this.p1] = base.copyOne(b)
        }
        if (base.isPyrimidine(b)) {
            return
        }
    }
    this.quit()
}

function rpu() {
    for (let b = this.s[++this.p]; b; b = this.s[++this.p]) {
        if (this.copying) {
            this.s1[--this.p1] = base.copyOne(b)
        }
        if (base.isPurine(b)) {
            return
        }
    }
    this.quit()
}

function lpy() {
    for (let b = this.s[--this.p]; b; b = this.s[--this.p]) {
        if (this.copying) {
            this.s1[++this.p1] = base.copyOne(b)
        }
        if (base.isPyrimidine(b)) {
            return
        }
    }
    this.quit()
}

function lpu() {
    for (let b = this.s[--this.p]; b; b = this.s[--this.p]) {
        if (this.copying) {
            this.s1[++this.p1] = base.copyOne(b)
        }
        if (base.isPurine(b)) {
            return
        }
    }
    this.quit()
}
const acid = [
    [null, cut, del, swi],
    [mvr, mvl, cop, off],
    [ina, inc, ing, int],
    [rpy, rpu, lpy, lpu]
]
const acidIndex = "ACGT"

function translate(s) {
    let result = new Enzyme([])
    let results = [result]
    for (let i = 0; i < s.length - 1; i += 2) {
        let amino = acid[acidIndex.indexOf(s[i])][acidIndex.indexOf(s[i + 1])]
        if (amino)
            result.gene.push(amino)
        else if (result.gene.length) {
            result.like = fold(result.gene)
            result = new Enzyme([])
            results.push(result)
        }
    }
    result.like = fold(result.gene)
    return results
}
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
module.exports = {
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
    lpu,
    translate
}