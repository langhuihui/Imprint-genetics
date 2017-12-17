# 印符遗传学
* 本程序实现的功能是《GEB》一书中描写的印符遗传学的内容
* 印符遗传学是真实的遗传学的简化版本
* 该理论和自指概念有关，讲述了RNA如何复制自己的过程
## 基本概念
1. 碱基

一共有5种，程序为了简便只采用4种
> A—腺嘌呤、G—鸟嘌呤、T—胸腺嘧啶、C—胞嘧啶、U—尿嘧啶(DNA中的T)

2. RNA

是由碱基串组成的，类似于字符串
例如AAGGTTCGA

3. 氨基酸（amino acid）

用于组成蛋白质的基本单位，共有15种
|类型|功能
|---|----
|cut|切断串
|del|从串里删除一个基
|swi|把酶转移到另一个串上
|mvr|右移一个单元
|mvl|左移一个单元
|cop|进入复制状态
|off|退出复制状态
|ina|在本单元右侧插入A
|inc|在本单元右侧插入C
|ing|在本单元右侧插入G
|int|在本单元右侧插入T
|rpy|寻找右边最近的嘧啶
|rpu|寻找右边最近的嘌呤
|lpy|寻找左边最近的嘧啶
|lpu|寻找左边最近的嘌呤

4. 酶（enzyme）

蛋白质的一种，可以作用于RNA上，执行RNA的命令，酶是由氨基酸组成

5. 核糖体（ribosome）

可以将RNA序列翻译成酶

6. 复制状态

一个串可以复制成另一个串，但是规则是嘌呤复制成嘧啶，嘧啶拷贝成嘌呤，这叫做补基对
    
    A<==>T
    G<==>C

酶进入复制状态后，会生成一个补串，倒挂在当前串上面

## 翻译

翻译是由核糖体进行的，根据串中的碱基二元组进行翻译


| | A | C | G | T 
|---|:---:|:---:|:---:|:---:
|A||cut|del|swi
|C|mvr|mvl|cop|off
|G|ina|inc|ing|int
|T|rpy|rpu|lpy|lpu

例如TAGATCCAGTCCACATCGA两两分组后

得到TA GA TC CA GT CC AC AT CG A
翻译成酶后：

rpy-ina-rpu-mvr-int-mvl-cut-swi-cop

## 酶的三级结构
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
> s代表直行，l代表左拐，r代表右拐

cop

↑

swi←cut←mvl←int

            ↑
            mvr
            ↑
rpy → ina→    rpu


第一段和最后一段的方向决定了酶一开始喜欢拴在哪个碱基上面
|第一段|最后一段|所栓的碱基
|:-:|:-:|:-:|
|→|→|A
|→|↑|C
|→|↓|G
|→|←|T

