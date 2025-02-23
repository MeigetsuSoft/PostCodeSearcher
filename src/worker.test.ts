import Worker from './worker';

describe('Worker Test', () => {
    it('should return worker', () => {
        const worker = new Worker('東京都');
        expect(worker.get('1000000')).toStrictEqual({
            id: expect.any(Number),
            postcode: '1000000',
            prefecture: '東京都',
            city: '千代田区',
        });
        expect(worker.get('107-0062')).toStrictEqual({
            id: expect.any(Number),
            postcode: '107-0062',
            prefecture: '東京都',
            city: '港区',
            address: '南青山',
        });
    });
    it('should return new address', () => {
        const worker = new Worker('千葉県');
        expect(worker.get('2700104')).toStrictEqual({
            id: expect.any(Number),
            postcode: '2700104',
            prefecture: '千葉県',
            city: '流山市',
            address: '森のロジスティクスパーク',
            prefecture_kana: 'チバケン',
            city_kana: 'ナガレヤマシ',
            address_kana: 'モリノロジスティクスパーク',
        });
    });
    it('should return updated address', () => {
        const worker = new Worker('東京都');
        expect(worker.get('1630701')).toStrictEqual({
            id: 1751,
            postcode: '1630701',
            prefecture: '東京都',
            city: '新宿区',
            address: '西新宿２丁目７番１号　新宿第一生命ビルディング１階',
            prefecture_kana: 'トウキョウト',
            city_kana: 'シンジュクク',
            address_kana: 'ニシシンジュク２チョウメ７バン１ゴウ　シンジュクダイイチセイメイビルディング１カイ',
        });
    });
    it('should return postcode only(no data)', () => {
        const worker = new Worker('東京都');
        expect(worker.get('2700104')).toStrictEqual({
            postcode: '2700104', // 本来、千葉県流山市森のロジスティクスパークの郵便番号なので、東京都のワーカーでは検索できず、郵便番号のみ返す
        });
    });
    it('should return postcode only(deleted)', () => {
        const worker = new Worker('長野県');
        expect(worker.get('3994501')).toStrictEqual({
            postcode: '3994501', // 長野県伊那市西箕輪の郵便番号だったが、削除されているので、郵便番号のみ返す
        });
    });
    it('post code format error', () => {
        const worker = new Worker('東京都');
        expect(worker.get('1000-000')).toStrictEqual({
            postcode: '1000-000', // 郵便番号のハイフン位置が間違っているので、郵便番号のみ返す
        });
        expect(worker.get('10000000')).toStrictEqual({
            postcode: '10000000', // 郵便番号の桁数が間違っているので、郵便番号のみ返す
        });
    });
    it('iterator check', () => {
        const worker = new Worker('東京都');
        for (const record of worker) {
            expect(record).toStrictEqual(worker.get(record.postcode));
        }
    });
});
