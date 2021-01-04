const koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const port = 3100;

const app = new koa();
const router = new KoaRouter();

app.use(json());


// app.use(async ctx => (ctx.body = {text:'Welcome to Koa'}));
router.get('/home', ctx => (ctx.body = {text:'Welcome to Koa'}))

app.use(router.routes()).use(router.allowedMethods());

app.listen(port,  () =>  console.log('Running'));