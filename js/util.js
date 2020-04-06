const setCookie = (key, value, path = '/') => {
    document.cookie = key + '=' + encodeURIComponent(value) + ';path=' + path;
};

const getCookie = () => {
    let output = {};
    document.cookie.split(/\s*;\s*/).forEach((pair) => {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair[1];
    });
    return output;
};

const toggle_classes = (element, class1, class2) => {
    if (element.classList.contains(class1)) {
        element.classList.remove(class1);
        element.classList.add(class2);
    } else {
        element.classList.remove(class2);
        element.classList.add(class1);
    }
};

const touchesAreEqual = (t1, t2, epsilon = 5) => {
    if(Math.abs(t2.clientX - t1.clientX) <= epsilon &&
       Math.abs(t2.clientY - t1.clientY) <= epsilon)
       return true;
    return false;
};

Math.randomBelow = (lim) => Math.floor(Math.random()*lim);

Array.prototype.swap = function(ai, bi) {
        let tmp = this[ai];
        this[ai] = this[bi];
        this[bi] = tmp;
}

Array.prototype.shuffle = function() {
    for(let i = 0; i < this.length; i++) {
        let ai = i;
        let bi = Math.randomBelow(this.length);
        this.swap(ai, bi);
    }
    return this;
};

Array.prototype.random = function() {
    return this[Math.randomBelow(this.length)];
}

Object.prototype.toArray = function() {
    let out = [];
    for(let i in this) if(this.hasOwnProperty(i)) {
        out.push(this[i]);
    }
    return out;
};