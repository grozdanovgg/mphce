import { DocumentReference, WriteResult, Firestore } from '@google-cloud/firestore';
import PoolModel from '../models/PoolModel';
import * as express from 'express';
import PoolService from '../services/PoolService';
import { debug } from 'util';
import DB from '../database/repository';
import Server from '../server';

// const db: Firestore = new Database().db;

class PoolController {

    public getAllPools(req: express.Request, res: express.Response, next: express.NextFunction): void {

        DB.getCollection('pools')
            .then((collection) => {

                const url: string = 'https://www.omegapool.cc/index.php?coin=raven&page=blocks';

                collection.forEach((pool) => {
                    const poolData: Object = pool.data;
                    PoolService.getHopStatus(poolData['url'], poolData['lastBlockHtmlSelector'])
                        .then((data) => {
                            console.log(data);

                        }).catch((err) => {
                            console.log(err);
                        });
                })

                res.status(200).json(collection);
            })
            .catch((error) => {
                console.log('Error getting documents', error);
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });

        // PoolModel
        //     .findOne({
        //         name: req.query.name
        //     })
        //     .then((data) => {

        //         const url: string = 'https://www.omegapool.cc/index.php?coin=raven&page=blocks';

        //         PoolService.getHopStatus(data['url'], data['lastBlockHtmlSelector'])
        //             .then((data) => {
        //                 console.log(data);
        //                 res.status(200).json({ data });

        //             }).catch((err) => {
        //                 console.log(err);
        //             });

        //         // res.status(200).json({ data });
        //     })
        //     .catch((error: Error) => {
        //         res.status(500).json({
        //             error: error.message,
        //             errorStack: error.stack
        //         });
        //         next(error);
        //     });
    }

    public createPool(req: express.Request, res: express.Response, next: express.NextFunction): void {

        DB.setDocInCollection('pools', req.body.name, {
            name: req.body.name,
            url: req.body.url,
            lastBlockHtmlSelector: req.body.lastBlockHtmlSelector
        })
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });

        // PoolModel
        //     .create({
        //         name: req.body.name,
        //         url: req.body.url,
        //         lastBlockHtmlSelector: req.body.lastBlockHtmlSelector
        //     })
        //     .then((data) => {
        //         res.status(200).json({ data });
        //     })
        //     .catch((error: Error) => {
        //         res.status(500).json({
        //             error: error.message,
        //             errorStack: error.stack
        //         });
        //         next(error);
        //     });
    }

    public updatePool(req: express.Request, res: express.Response, next: express.NextFunction): void {

        PoolModel
            .findOneAndUpdate(
                { name: req.body.name },
                // tslint:disable-next-line:ter-indent
                {
                    // tslint:disable-next-line:ter-indent
                    $set: {
                        name: req.body.name,
                        url: req.body.url,
                        lastBlockHtmlSelector: req.body.lastBlockHtmlSelector
                    }
                    // tslint:disable-next-line:ter-indent
                })
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });
    }

    public deletePool(req: express.Request, res: express.Response, next: express.NextFunction): void {

        PoolModel
            .remove(
                { name: { $eq: req.body.name } }
            )
            .then((data) => {
                res.status(200).json({ data });
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error.message,
                    errorStack: error.stack
                });
                next(error);
            });
    }

}

export default new PoolController();
