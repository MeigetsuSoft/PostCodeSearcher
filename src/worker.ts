import { existsSync, readdirSync, statSync } from 'fs';
import { readDataFromCSV, readDataFromJson } from './read';
import { PostCodeRecord } from './PostCodeRecord';
import equalObj from './equalObj';

export default class Worker {
    private Record: PostCodeRecord<number, string>[];
    constructor(prefecture: string) {
        this.Record = readDataFromJson(`./postcodes/master/${prefecture}.json`);
        if (existsSync(`./postcodes/patch`) && statSync(`./postcodes/patch`).isDirectory()) {
            readdirSync(`./postcodes/patch`)
                .map(dir => `./postcodes/patch/${dir}`)
                .filter(i => statSync(i).isDirectory())
                .sort()
                .forEach(dir => {
                    const AddRecordReadResult = readDataFromCSV(dir + '/ADD.CSV').filter(
                        i => i.prefecture === prefecture
                    );
                    const DelRecordReadResult = readDataFromCSV(dir + '/DEL.CSV').filter(
                        i => i.prefecture === prefecture
                    );
                    DelRecordReadResult.forEach(i => {
                        const index = this.Record.findIndex(j => equalObj(i, j));
                        if (index !== -1) this.Record.splice(index, 1);
                    });
                    AddRecordReadResult.forEach(i => {
                        this.Record.push(i);
                    });
                });
        }
        this.Record.sort((a, b) => a.id - b.id);
    }
    public get max(): number {
        return this.Record[this.Record.length - 1].id;
    }
    public get min(): number {
        return this.Record[0].id;
    }
    private InternalGetPostCodeInformation(
        PostCode: number,
        range: { begin: number; end: number }
    ): { pos: number; data: PostCodeRecord<number, string> } | undefined {
        if (PostCode === this.Record[range.begin].id) return { pos: range.begin, data: this.Record[range.begin] };
        if (PostCode === this.Record[range.end].id) return { pos: range.end, data: this.Record[range.end] };
        const Center: number = Math.floor((range.end - range.begin) / 2) + range.begin;
        if (PostCode === this.Record[Center].id) return { pos: Center, data: this.Record[Center] };
        else {
            if (range.end - range.begin <= 20) {
                const index = this.Record.slice(range.begin + 1, range.end).findIndex(i => i.id === PostCode);
                if (index === -1) return undefined;
                else return { pos: index + range.begin + 1, data: this.Record[index + range.begin + 1] };
            } else
                return PostCode > this.Record[Center].id
                    ? this.InternalGetPostCodeInformation(PostCode, { begin: Center + 1, end: range.end })
                    : this.InternalGetPostCodeInformation(PostCode, { begin: range.begin, end: Center - 1 });
        }
    }
    public get(postcode: string): PostCodeRecord<number, string>[] | { postcode: string } {
        if (postcode.length < 3 || postcode.length > 8) return { postcode: postcode };
        if (!/^\d{3}-?\d{4}$/.test(postcode)) return { postcode: postcode };
        const Ret = this.InternalGetPostCodeInformation(parseInt(postcode.replace('-', '')), {
            begin: 0,
            end: this.Record.length - 1,
        });
        if (Ret == null) return { postcode: postcode };
        const Res = [Ret.data];
        for (let i = Ret.pos - 1; i >= 0; i--) {
            if (this.Record[i].postcode !== Ret.data.postcode) break;
            Res.unshift(this.Record[i]);
        }
        for (let i = Ret.pos + 1; i < this.Record.length; i++) {
            if (this.Record[i].postcode !== Ret.data.postcode) break;
            Res.push(this.Record[i]);
        }
        return Res;
    }
}
