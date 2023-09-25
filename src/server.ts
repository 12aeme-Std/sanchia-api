/* eslint-disable import/first */
/// <reference types="./types/request.d.ts" />
require('express-async-errors');
import express from 'express';
import baseRouter from './common/base-router';
import errorHandler from './middlewares/error.mid';
import passportConfig from './config/passport';
import passport from 'passport';
import cors from 'cors';

passport.use(passportConfig());

const app = express();

app.use(cors());

passportConfig();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use('/api', baseRouter);

app.use(errorHandler);

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Running on port: ${process.env.PORT!}`);
});

// test
