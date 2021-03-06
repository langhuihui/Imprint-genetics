/**
 * 氨基酸
 */
const base = require('./base')

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
    this.produce(this.s)
    this.produce(s.slice(this.p + 1))
    this.remove(s)
    let s1 = this.s1
    if (s1) { //剪切补串
        if (this.p1 > 0 && this.p1 < s1.length) {
            this.s1 = s1.slice(this.p1)
            this.produce(s1.slice(0, this.p1))
            this.produce(this.s1)
            this.remove(s1)
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
        this.produce(this.s1)
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
    lpu
}