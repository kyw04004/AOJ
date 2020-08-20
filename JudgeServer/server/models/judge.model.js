import { StateSchema } from './schema.model.js';
import { ProblemSchema } from './schema.model.js';
import { PendingSchema } from './schema.model.js';

export class PendingModel {
    static front = async () => {
        try {
            const result = await PendingSchema.find()
                .sort('number').limit(1);
            if (result.length === 0) throw new Error('No pending');
            return result[0];
        } catch (err) {
            if (err.message !== 'No pending')
                err.message = 'Pending front error';
            err.message = 'Model -> ' + err.message;
            throw err;
        }
    };
    static push = async(number) => {
        try {
            const newPending = new PendingSchema({
                number : number
            });

            await newPending.save();
        } catch (err) {
            err.message = 'Model -> Push pending error';
            throw err;
        }
    }
    static delete = async(number) => {
        try {
            await PendingSchema
                .deleteOne()
                .where({'number' : number});
        } catch (err) {
            err.message = 'Model -> Delete pending error';
            throw err;
        }
    }
}

export class ProblemModel {
    static find = async (number) => {
        try {
            const result = await ProblemSchema.findOne()
                .where({'number': number});
            if(result === null) throw new Error('Not exist problem');
            return result;
        } catch (err) {
            if(err.message !== 'Not exist problem')
                err.message = 'Find Problem Error';
            err.message = 'Model -> ' + err.message;
            throw err;
        }
    };
}

export class StateModel {
    static push = async (data) => {
        try {
            const result = await StateSchema.find()
                .sort('-number').limit(1);

            const max = result.length !== 0 ? result[0].number + 1 : 1;
            const newState = new StateSchema({
                code : data.code,
                lang : data.lang,
                problemNum : data.problemNum,
                userName : data.userName,
                number : max
            });

            await newState.save();
            return newState.number;
        } catch (err) {
            throw new Error('Model -> ' + err.message);
        }
    }

    static find = async (number) => {
        try {
            const result = await StateSchema.findOne()
                .where({'number': number});
            if(result === null) throw new Error('Not found state');
            return result;
        } catch (err) {
            if(err.message !== 'Not found state')
                err.message = 'Find State Error';
            err.message = 'Model -> ' + err.message;
            throw err;
        }
    };
    static update = async (number, state, msg, time, memory) => {
        try {
            const result = await StateSchema.updateOne(
                {'number' : number},
                {$set : { 'message' : msg, 'state' : state, 'time' : time, 'memory' : memory }});
            if(result === null) throw new Error('Update state error');
        } catch (err) {
            throw new Error('Model -> ' + err.message);
        }
    }
}