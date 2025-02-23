import { ConvertNarrowToWideKana, readDataFromCSV, readDataFromJson } from './read';

describe('Convert narrow to wide kana', () => {
    it('Check', () => {
        expect(ConvertNarrowToWideKana('ｱｲｳｴｵ')).toBe('アイウエオ');
        expect(ConvertNarrowToWideKana('ｶﾞｷﾞｸﾞｹﾞｺﾞ')).toBe('ガギグゲゴ');
        expect(ConvertNarrowToWideKana('ｻﾞｼﾞｽﾞｾﾞｿﾞ')).toBe('ザジズゼゾ');
        expect(ConvertNarrowToWideKana('ﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞ')).toBe('ダヂヅデド');
        expect(ConvertNarrowToWideKana('ﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞ')).toBe('バビブベボ');
        expect(ConvertNarrowToWideKana('ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ')).toBe('パピプペポ');
        expect(ConvertNarrowToWideKana('ｳﾞﾜﾞｦﾞ')).toBe('ヴヷヺ');
        expect(ConvertNarrowToWideKana('ｻｰﾊﾞｰｱﾌﾟﾘｹｰｼｮﾝ')).toBe('サーバーアプリケーション');
    });
});

describe('reader test', () => {
    describe('read data from json', () => {
        it('OK', () => {
            const Data = readDataFromJson('./postcodes/master/北海道.json');
            expect(Data[0]).toStrictEqual({
                id: 0,
                city: '札幌市中央区',
                postcode: '0600000',
                prefecture: '北海道',
            });
            expect(Data[1]).toStrictEqual({
                id: 1,
                address: '旭ケ丘',
                postcode: '0640941',
                prefecture: '北海道',
                city: '札幌市中央区',
            });
        });
        it('Not found', () => {
            expect(() => readDataFromJson('./notfound.json')).toThrow('./notfound.json: File not found');
        });
    });

    describe('read data from csv', () => {
        it('OK', () => {
            const Data = readDataFromCSV('./KEN_ALL.CSV');
            expect(Data[0]).toStrictEqual({
                id: 0,
                city: '札幌市中央区',
                postcode: '0600000',
                prefecture: '北海道',
                prefecture_kana: 'ホッカイドウ',
                city_kana: 'サッポロシチュウオウク',
            });
            expect(Data[1]).toStrictEqual({
                id: 1,
                city: '札幌市中央区',
                postcode: '0640941',
                prefecture: '北海道',
                address: '旭ケ丘',
                prefecture_kana: 'ホッカイドウ',
                city_kana: 'サッポロシチュウオウク',
                address_kana: 'アサヒガオカ',
            });
        });
        it('Not found', () => {
            expect(() => readDataFromCSV('./notfound.csv')).toThrow('./notfound.csv: File not found');
        });
        it('Empty', () => {
            expect(readDataFromCSV('./EmptyCSV.csv')).toStrictEqual([]);
        });
    });
});
