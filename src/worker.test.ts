import Worker from './worker';

describe('Worker Test', () => {
    it('should return worker', () => {
        const worker = new Worker('東京都');
        expect(worker.get('1000000')).toStrictEqual([
            {
                id: 1000000,
                postcode: '100-0000',
                prefecture: '東京都',
                city: '千代田区',
                prefecture_kana: 'トウキョウト',
                city_kana: 'チヨダク',
            },
        ]);
        expect(worker.get('107-0062')).toStrictEqual([
            {
                id: 1070062,
                postcode: '107-0062',
                prefecture: '東京都',
                city: '港区',
                address: '南青山',
                prefecture_kana: 'トウキョウト',
                city_kana: 'ミナトク',
                address_kana: 'ミナミアオヤマ',
            },
        ]);
    });
    it('should return new address', () => {
        const worker = new Worker('千葉県');
        expect(worker.get('2700104')).toStrictEqual([
            {
                id: 2700104,
                postcode: '270-0104',
                prefecture: '千葉県',
                city: '流山市',
                address: '森のロジスティクスパーク',
                prefecture_kana: 'チバケン',
                city_kana: 'ナガレヤマシ',
                address_kana: 'モリノロジスティクスパーク',
            },
        ]);
    });
    it('should return updated address', () => {
        const worker = new Worker('青森県');
        expect(worker.get('0391564')).toStrictEqual([
            {
                id: 391564,
                postcode: '039-1564',
                prefecture: '青森県',
                city: '三戸郡五戸町',
                address: '古館下川原',
                prefecture_kana: 'アオモリケン',
                city_kana: 'サンノヘグンゴノヘマチ',
                address_kana: 'フルダテシモカワラ',
            },
        ]);
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
    it('should return multiple records', () => {
        const worker = new Worker('千葉県');
        const result = worker.get('2760035');
        if (!Array.isArray(result)) throw new Error('result is not array');
        expect(result.length).toBeGreaterThan(1);
        expect(result).toStrictEqual([
            {
                id: 2760035,
                postcode: '276-0035',
                prefecture: '千葉県',
                city: '八千代市',
                address: '大和田新田',
                prefecture_kana: 'チバケン',
                city_kana: 'ヤチヨシ',
                address_kana: 'オオワダシンデン',
            },
            {
                id: 2760035,
                postcode: '276-0035',
                prefecture: '千葉県',
                city: '八千代市',
                address: '高津',
                prefecture_kana: 'チバケン',
                city_kana: 'ヤチヨシ',
                address_kana: 'タカツ',
            },
        ]);
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
});
