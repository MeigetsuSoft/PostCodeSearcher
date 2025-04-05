import equalObj from './equalObj';

describe('equalObj', () => {
    it('should return true for identical objects', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 } };
        expect(equalObj(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 3 } };
        expect(equalObj(obj1, obj2)).toBe(false);
    });

    it('should return false for different lengths', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 }, d: 3 };
        expect(equalObj(obj1, obj2)).toBe(false);
    });

    it('should return false for different keys', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { d: 2 } };
        expect(equalObj(obj1, obj2)).toBe(false);
    });

    it('should return false for different types', () => {
        const obj1 = { a: 1, b: { c: '2' } };
        const obj2 = { a: 1, b: { c: 2 } };
        expect(equalObj(obj1, obj2)).toBe(false);
    });
});
