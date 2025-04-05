export default function equalObj(a: Object, b: Object): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (!aKeys.every(i => bKeys.includes(i)) || !bKeys.every(i => aKeys.includes(i))) return false;
    return aKeys.every(i => {
        if (typeof a[i] !== typeof b[i]) return false;
        return typeof a[i] === 'object' ? equalObj(a[i], b[i]) : a[i] === b[i];
    });
}
