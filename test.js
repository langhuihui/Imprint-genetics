const ribosome = require('./ribosome')
let ss = new Set()
let enzymes = new Map()

let start = "ATGCCGGCTTGAAAAGTCCCTTGGTTCAAACCA"

function recursion(enzyme) {
    enzyme.ss.forEach(s => {
        let str = s.join('')
        if (!ss.has(str)) {
            ss.add(str)
            setImmediate(exec, s)
                //console.log(str, enzymes.size)
            setImmediate(translate, str)
        } else {
            console.log(str)
        }
    })
    enzyme.ss.clear()
}

function exec(s) {
    enzymes.forEach(enzyme => {
        enzyme.exec(s)
        recursion(enzyme)
    })
}

function translate(string) {
    ribosome(string).forEach(enzyme => {
        if (!enzyme.like) return
        if (!enzymes.has(enzyme.toString())) {
            enzymes.set(enzyme.toString(), enzyme)
            ss.forEach(s => enzyme.exec(s.split('')))
        }
        recursion(enzyme)
    })
}
ss.add(start)
translate(start)