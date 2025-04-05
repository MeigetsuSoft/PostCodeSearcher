import PostCodeDataLoader from '.';

describe('PostCodeDataLoader', () => {
    const PCDL = new PostCodeDataLoader();
    it('should return record', () => {
        expect(PCDL.get('1000000')).toStrictEqual([
            {
                id: 1000000,
                postcode: '100-0000',
                prefecture: '東京都',
                city: '千代田区',
                prefecture_kana: 'トウキョウト',
                city_kana: 'チヨダク',
            },
        ]);
        expect(PCDL.get('107-0062')).toStrictEqual([
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
        expect(PCDL.get('2700104')).toStrictEqual([
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
        expect(PCDL.get('1630701')).toStrictEqual([
            {
                id: 1630701,
                postcode: '163-0701',
                prefecture: '東京都',
                city: '新宿区',
                address: '西新宿２丁目７番１号　新宿第一生命ビルディング１階',
                prefecture_kana: 'トウキョウト',
                city_kana: 'シンジュクク',
                address_kana: 'ニシシンジュク２チョウメ７バン１ゴウ　シンジュクダイイチセイメイビルディング１カイ',
            },
        ]);
    });
    it('should return postcode only(no data)', () => {
        expect(PCDL.get('1234567')).toStrictEqual({
            postcode: '1234567', // 123-4567は存在しないので、郵便番号のみ返す
        });
    });
    it('should return postcode only(deleted)', () => {
        expect(PCDL.get('3994501')).toStrictEqual({
            postcode: '3994501', // 長野県伊那市西箕輪の郵便番号だったが、削除されているので、郵便番号のみ返す
        });
    });
    it('post code format error', () => {
        expect(PCDL.get('1000-000')).toStrictEqual({
            postcode: '1000-000', // 郵便番号のハイフン位置が間違っているので、郵便番号のみ返す
        });
        expect(PCDL.get('10000000')).toStrictEqual({
            postcode: '10000000', // 郵便番号の桁数が間違っているので、郵便番号のみ返す
        });
    });
});
