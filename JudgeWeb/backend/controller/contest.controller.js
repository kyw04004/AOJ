import { NoticeService } from '../service/notice.service.js';
import ProblemService from '../service/problem.service.js';
import ScoreboardService from '../service/scoreboard.service.js';
import StatusService from '../service/status.service';
import ContestService from '../service/contest.service';

export default class Contest {
    static update = async(req, res, next) => {
        try {
            const result = await ContestService.update(req);
            return res.status(200).json(result);
        } catch(err) {
            err.message = 'GET /contest/update\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static delete = async(req, res, next) => {
        try {
            const result = await ContestService.delete(req.params.id);
            return res.status(200).json(result);
        } catch(err) {
            err.message = 'GET /contest/delete\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getNotice = async (req, res, next) => {
        try {
            const result = await NoticeService.getNotice(req);
            return res.status(200).json(result);
        } catch (err) {
            err.message = 'Get /contest/notice\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static createPost = async (req, res, next) => {
        try {
            if(req.body.isQnA === false && req.decoded.name !== 'admin'){
                const err = new Error();
                err.message = 'Unauthorized User';
                err.status = 403;
                next(err);
            }
            await NoticeService.createPost(req);
            return res.status(200).send(true);
        } catch (err) {
            err.message = 'POST /contest/post\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static createReply = async (req, res, next) => {
        try {
            await NoticeService.createReply(req);
            return res.status(200).send(true);
        } catch (err) {
            err.message = 'POST /contest/reply\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getScoreboard = async (req, res, next) => {
        try {
            const number = req.params.id;
            const result = await ScoreboardService.get(number);
            return res.status(200).json(result);
        } catch (err) {
            err.message = 'Get /contest/scoreboard\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getStatus = async (req, res, next) => {
        try {
            const number = req.params.id;
            const user = req.body.user;
            const result = await StatusService.get(number, user);
            return res.status(200).json(result);
        } catch (err) {
            err.message = 'POST /contest/status\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static createContest = async (req, res, next) => {
        try {
            const result = await ContestService.Save(req);
            if(result === true) return res.status(200).json({result : 1});
            else return res.status(200).json({result : 2});
        } catch(err) {
            err.message = 'POST /contest/create\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getContest = async(req, res, next) => {
        try {
            const result = await ContestService.Get();
            return res.status(200).json(result);
        } catch(err) {
            err.message = 'GET /contest/list\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getOne = async(req, res, next) => {
        try {
            const number = req.params.id;
            const result = await ContestService.getOne(number);
            return res.status(200).json(result);
        } catch(err) {
            err.message = 'GET /contest/userlist\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
    static getProblemList = async (req, res, next) => {
        try {
            const competitionNum = req.params.competitionNum;
            const result = await ProblemService.getProblemList(competitionNum);
            return res.status(200).json(result);
        } catch (err) {
            err.message = 'GET /contest\nController -> ' + err.message;
            err.status = 400;
            next(err);
        }
    }
}