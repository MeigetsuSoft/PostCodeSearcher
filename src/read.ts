import { readCSV, readJson } from 'nodeeasyfileio';
import { PostCodeRecord } from './PostCodeRecord';
import { existsSync } from 'node:fs';

export function readDataFromJson<IDType = number>(FilePath: string): PostCodeRecord<IDType, string>[] {
    if (!existsSync(FilePath)) throw new Error(`${FilePath}: File not found`);
    return readJson<{ postcodes: PostCodeRecord<IDType, string>[] }>(FilePath).postcodes;
}

const hankakuToZenkakuMap = {
    ｶﾞ: 'ガ',
    ｷﾞ: 'ギ',
    ｸﾞ: 'グ',
    ｹﾞ: 'ゲ',
    ｺﾞ: 'ゴ',
    ｻﾞ: 'ザ',
    ｼﾞ: 'ジ',
    ｽﾞ: 'ズ',
    ｾﾞ: 'ゼ',
    ｿﾞ: 'ゾ',
    ﾀﾞ: 'ダ',
    ﾁﾞ: 'ヂ',
    ﾂﾞ: 'ヅ',
    ﾃﾞ: 'デ',
    ﾄﾞ: 'ド',
    ﾊﾞ: 'バ',
    ﾋﾞ: 'ビ',
    ﾌﾞ: 'ブ',
    ﾍﾞ: 'ベ',
    ﾎﾞ: 'ボ',
    ﾊﾟ: 'パ',
    ﾋﾟ: 'ピ',
    ﾌﾟ: 'プ',
    ﾍﾟ: 'ペ',
    ﾎﾟ: 'ポ',
    ｳﾞ: 'ヴ',
    ﾜﾞ: 'ヷ',
    ｦﾞ: 'ヺ',
    ｱ: 'ア',
    ｲ: 'イ',
    ｳ: 'ウ',
    ｴ: 'エ',
    ｵ: 'オ',
    ｶ: 'カ',
    ｷ: 'キ',
    ｸ: 'ク',
    ｹ: 'ケ',
    ｺ: 'コ',
    ｻ: 'サ',
    ｼ: 'シ',
    ｽ: 'ス',
    ｾ: 'セ',
    ｿ: 'ソ',
    ﾀ: 'タ',
    ﾁ: 'チ',
    ﾂ: 'ツ',
    ﾃ: 'テ',
    ﾄ: 'ト',
    ﾅ: 'ナ',
    ﾆ: 'ニ',
    ﾇ: 'ヌ',
    ﾈ: 'ネ',
    ﾉ: 'ノ',
    ﾊ: 'ハ',
    ﾋ: 'ヒ',
    ﾌ: 'フ',
    ﾍ: 'ヘ',
    ﾎ: 'ホ',
    ﾏ: 'マ',
    ﾐ: 'ミ',
    ﾑ: 'ム',
    ﾒ: 'メ',
    ﾓ: 'モ',
    ﾔ: 'ヤ',
    ﾕ: 'ユ',
    ﾖ: 'ヨ',
    ﾗ: 'ラ',
    ﾘ: 'リ',
    ﾙ: 'ル',
    ﾚ: 'レ',
    ﾛ: 'ロ',
    ﾜ: 'ワ',
    ｦ: 'ヲ',
    ﾝ: 'ン',
    ｧ: 'ァ',
    ｨ: 'ィ',
    ｩ: 'ゥ',
    ｪ: 'ェ',
    ｫ: 'ォ',
    ｯ: 'ッ',
    ｬ: 'ャ',
    ｭ: 'ュ',
    ｮ: 'ョ',
    '｡': '。',
    '､': '、',
    ｰ: 'ー',
    ﾞ: '゛',
    ﾟ: '゜',
    ' ': '　',
};

export function ConvertNarrowToWideKana(Kana: string): string {
    if (Kana == null) return Kana;
    Object.keys(hankakuToZenkakuMap).forEach(i => {
        Kana = Kana.replaceAll(i, hankakuToZenkakuMap[i]);
    });
    return Kana.replace(/[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, s =>
        String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    );
}

export function readDataFromCSV(FilePath: string): PostCodeRecord<number, string>[] {
    if (!existsSync(FilePath)) throw new Error(`${FilePath}: File not found`);
    const Data = readCSV(FilePath);
    return Data.filter(i => i.length > 9 && i.some(j => j != null && j !== ''))
        .map((i, index) => {
            i = i.map(j => j.replaceAll('"', ''));
            const Data = {
                id: index,
                postcode: i[2],
                prefecture: i[6],
                city: i[7],
                address: i[8] === '以下に掲載がない場合' ? undefined : i[8],
                prefecture_kana: ConvertNarrowToWideKana(i[3]),
                city_kana: ConvertNarrowToWideKana(i[4]),
                address_kana: i[5] === 'ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ' ? undefined : ConvertNarrowToWideKana(i[5]),
            };
            Object.keys(Data).forEach(j => {
                if (Data[j] == null || Data[j] === '') delete Data[j];
            });
            return Data;
        })
        .filter(i => i.postcode != null);
}
