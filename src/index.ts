import Worker from './worker';
import { PostCodeRecord } from './PostCodeRecord';
import { readdirSync } from 'fs';

export default class PostCodeDataLoader {
    private Data: { prefecture: string; start: number; last: number; worker: Worker }[];
    constructor() {
        const prefectures = readdirSync('./postcodes/master')
            .filter(i => i.endsWith('.json'))
            .map(i => i.replace('.json', ''));
        this.Data = prefectures.map(i => {
            const worker = new Worker(i);
            return {
                prefecture: i,
                start: worker.min,
                last: worker.max,
                worker: worker,
            };
        });
    }
    public get(postcode: string): PostCodeRecord<number, string>[] | { postcode: string } {
        const postcodeNum = parseInt(postcode.replace('-', ''));
        const Data = this.Data.filter(i => i.start <= postcodeNum && postcodeNum <= i.last);
        if (Data.length === 0) return { postcode: postcode };
        const Records = this.Data.map(i => {
            const WorkerResult = i.worker.get(postcode);
            return Array.isArray(WorkerResult) ? WorkerResult : [];
        }).flat(1);
        return Records.length > 0 ? Records : { postcode: postcode };
    }
}
