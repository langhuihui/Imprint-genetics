const aminoAcid = require('./amino acid')
let ss = new Set()
let enzymes = new Map()

let start = "ATGCCGGCTTGAAAAGTCCCTTGGTTCAAACCA"

function go(string) {
    aminoAcid.translate(string).forEach(enzyme => {
        if (!enzyme.like) return
        if (!enzymes.has(enzyme.toString())) {
            enzymes.set(enzyme.toString(), enzyme)
            ss.forEach(s => enzyme.exec(s.split('')))
        }
        enzyme.ss.forEach(s => {
            let str = s.join('')
            if (!ss.has(str)) {
                ss.add(str)
                    //console.log(str, enzymes.size)
                setImmediate(go, str)
            } else {
                console.log(str)
            }
        })
    })
}
ss.add(start)
go(start)