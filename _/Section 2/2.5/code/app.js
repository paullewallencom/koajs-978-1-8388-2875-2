/*const Koa = require('koa');
const KoaRouter = require('koa-router');*/

import Koa from 'koa';
import KoaRouter from 'koa-router';
import '@babel/polyfill';

const port = 3670;

const app = new Koa();
const router = new KoaRouter();

router.get('/test', ctx => {
    console.log(ctx.request.query),
    ctx.body = {text:'Context in Koa'},
    console.log(ctx.response)

});

router.get('/withouthell', async(ctx,next) => {
    const start = new Date;
    await next();
    const ms = new Date -start;
    ctx.body = {time:`Started at ${start}`,
                totaltime: `Elapsed: ${ms}ms`}

})

app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => { console.log('App is running')});
