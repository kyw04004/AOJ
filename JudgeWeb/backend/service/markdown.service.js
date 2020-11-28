import { MarkdownModel } from '../models/index.model';

export default class MarkdownService {
    static create = async (data) => {
        try {
            await MarkdownModel.create(data);
        } catch(err) {
            throw new Error('Service -> Markdown create' + err.message);
        }
    }
    static get = async () => {
        try {
            return await MarkdownModel.get();
        } catch(err) {
            throw new Error('Service -> Markdown get' + err.message);
        }
    }
}