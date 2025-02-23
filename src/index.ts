import { readJson } from 'nodeeasyfileio';
import Worker from './worker';
import { PostCodeRecord } from './PostCodeRecord';

export default class PostCodeDataLoader {
    private Data: { prefecture: string; start: number; last: number; worker: Worker }[];
    constructor() {
        const ranges = readJson<{ postcodes: { prefecture: string; start: number; last: number }[] }>(
            './postcodes/range.json'
        );
        this.Data = ranges.postcodes.map(i => ({ ...i, worker: new Worker(i.prefecture) }));
    }
    public get(postcode: string): PostCodeRecord<number, string> | { postcode: string } {
        const postcodeNum = parseInt(postcode.replace('-', ''));
        const Data = this.Data.find(i => i.start <= postcodeNum && postcodeNum <= i.last);
        return Data == null ? { postcode: postcode } : Data.worker.get(postcode);
    }
}
