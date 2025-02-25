import { readdirSync, statSync } from 'fs';
import { readDataFromCSV, readDataFromJson } from './read';
import { PostCodeRecord } from './PostCodeRecord';

export default class Worker {
    private Record: PostCodeRecord<number, string>[];
    constructor(prefecture: string) {
        this.Record = readDataFromJson(`./postcodes/master/${prefecture}.json`);
        readdirSync(`./postcodes/patch`)
            .map(dir => `./postcodes/patch/${dir}`)
            .filter(i => statSync(i).isDirectory())
            .sort()
            .forEach(dir => {
                const AddRecordReadResult = readDataFromCSV(dir + '/ADD.CSV').filter(i => i.prefecture === prefecture);
                const DelRecordReadResult = readDataFromCSV(dir + '/DEL.CSV').filter(i => i.prefecture === prefecture);
                const data = {
                    new: AddRecordReadResult.filter(
                        i => DelRecordReadResult.findIndex(j => j.postcode === i.postcode) === -1
                    ),
                    del: DelRecordReadResult.filter(
                        i => AddRecordReadResult.findIndex(j => j.postcode === i.postcode) === -1
                    ),
                    update: AddRecordReadResult.filter(
                        i => DelRecordReadResult.findIndex(j => j.postcode === i.postcode) !== -1
                    ),
                };
                data.new.forEach(i => {
                    this.Record.push(i);
                });
                data.del
                    .filter(i => i.prefecture === prefecture)
                    .forEach(i => {
                        const index = this.Record.findIndex(j => j.postcode === i.postcode);
                        if (index !== -1) this.Record.splice(index, 1);
                    });
                data.update.forEach(i => {
                    const index = this.Record.findIndex(j => j.postcode === i.postcode);
                    if (index !== -1) this.Record[index] = i;
                });
            });
        this.Record.sort((a, b) => a.id - b.id);
    }
    private InternalGetPostCodeInformation(
        PostCode: number,
        range: { begin: number; end: number }
    ): PostCodeRecord<number, string> | undefined {
        if (PostCode === this.Record[range.begin].id) return this.Record[range.begin];
        if (PostCode === this.Record[range.end].id) return this.Record[range.end];
        const Center: number = Math.floor((range.end - range.begin) / 2) + range.begin;
        if (PostCode === this.Record[Center].id) return this.Record[Center];
        else {
            if (range.end - range.begin <= 20)
                return this.Record.slice(range.begin + 1, range.end).find(i => i.id === PostCode);
            else
                return PostCode > this.Record[Center].id
                    ? this.InternalGetPostCodeInformation(PostCode, { begin: Center + 1, end: range.end })
                    : this.InternalGetPostCodeInformation(PostCode, { begin: range.begin, end: Center - 1 });
        }
    }
    public get(postcode: string) {
        if (!/^\d{3}-?\d{4}$/.test(postcode)) return { postcode: postcode };
        const Ret = this.InternalGetPostCodeInformation(parseInt(postcode.replace('-', '')), {
            begin: 0,
            end: this.Record.length - 1,
        });
        return Ret == null ? { postcode: postcode } : Ret;
    }
    [Symbol.iterator]() {
        return this.Record[Symbol.iterator]();
    }
}
