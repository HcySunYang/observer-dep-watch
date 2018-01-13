// Observer
class Observer {
    constructor (data) {
        this.walk(data)
    }
    walk (data) {
        // 遍历
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++){
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}

function defineReactive (data, key, val) {
    observer(val)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            //console.log('触发get')
            dep.depend()
            return val
        },
        set: function (newVal) {
            //console.log('触发set')
            if(val === newVal){
                return
            }
            observer(newVal)
            dep.notify()
        }
    })
}

function observer (data) {
    if(Object.prototype.toString.call(data) !== '[object Object]') {
        return
    }
    new Observer(data)
}

class Dep {
    constructor () {
        this.subs = []
    }
    depend () {
        this.subs.push(Dep.target)
    }
    notify () {
        for(let i = 0; i < this.subs.length; i++){
            this.subs[i].fn()
        }
    }
}

Dep.target = null

function pushTarget(watch){
    Dep.target = watch
}

// watch
class Watch {
    constructor (exp, fn) {
        this.exp = exp
        this.fn = fn
        pushTarget(this)
        //eval('data[exp]')
        quzhi(exp)
    }
}


function quzhi(exp) {
    var arrStr = exp.split('.');
    var str = 'data'
    for(var i=0; i<arrStr.length; i++){
        var item = arrStr[i];
        //str+= `[${item}]`
        str+= '["'+item+'"]'
        
    }
    console.log(eval(str), 'val')
}


var data = {
    a: 1,
    d: 12,
    b: {
        c: 2
    }
}

observer(data)

new Watch('a', () => {
    console.log(9)
})

new Watch('b.c', () => {
    console.log(80)
})

new Watch('d', () => {
    console.log(20)
})

setTimeout(() => {
    data.a = 10
    data.b.c = 3

}, 1000)