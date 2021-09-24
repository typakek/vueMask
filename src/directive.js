let bindingPatterns = {
    'L': new RegExp(/[A-Za-z]/g),                       //Latin
    'C': new RegExp(/[А-Яа-я]/g),                       //Cyrillic
    'N': new RegExp(/[0-9]/g),                          //Number
    'A': new RegExp(/[А-Яа-яA-Za-z]/g),                 //Any letter
    'S': new RegExp(/[abekmhopctyxABEKMHOPTCYX]/g),     //Vehicle registration plate
    'U': new RegExp(/[abekmhopctyxiABEKMHOPTCYXI]/g),   //Belarus vehicle registration plate
    'V': new RegExp(/[a-zA-Z0-9]/g),                    //VIN
    'H': new RegExp(/[0-9abekmhopctyxABEKMHOPTCYX]/g),  //Number and vehicle registration plate
    'R': new RegExp(/[0-9А-Яа-я]/g),                    //Russian and number
    'B': new RegExp(/[abeikmhopctxABEIKMHOPCTX]/g),                 //Belarus number
};
let regexpStr = '[' + Object.keys(bindingPatterns).join('') + ']';
let regExp = new RegExp(regexpStr, 'g');
let init = (el, binding, vnode) => {
    el.addEventListener('keypress', maskHandler.bind(this, vnode, binding));
};
let getValue = (target, object) => {
    let matches = object.split('.');
    if (matches.length > 2)
        return getValue(target[matches.splice(0, 1)], matches.join('.'));
    else if (matches.length === 2)
        return target[matches[0]][matches[1]];
    else
        return target[matches[0]]
};
let maskHandler = (vnode, binding, event) => {
    let mask = binding.value === binding.expression.replace(/['"]+/g, '')
        ? binding.value
        : getValue(vnode.context, binding.expression);
    if (mask.length === 0)
    	return;
    let oldValue = event.target.value,
        key = event.key,
        position = oldValue.length,
        toAdd = '';
    if (position >= mask.length) {
        event.preventDefault();
        return;
    }
    while (position < mask.length && !mask[position].match(regExp)) {
        toAdd += mask[position++];
    }
    let matches = key.match(bindingPatterns[mask[position]]);
    if (matches && matches.length) {
        event.preventDefault();
        event.target.value = event.target.value + toAdd + key;
        let newEvent = new Event('input');
        event.target.dispatchEvent(newEvent);
    } else {
        event.preventDefault();
    }
};
export default {
    bind: (el, binding, vnode) => init(el, binding, vnode)
}
