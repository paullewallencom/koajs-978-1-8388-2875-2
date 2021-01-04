const Koa = require('koa');
const KoaRouter = require('koa-router');
const port = 3670;

const app = new Koa();
const router = new KoaRouter();

router.get('/test', ctx => {
    console.log(ctx.request.query),
    ctx.body = {text:'Context in Koa'},
    console.log(ctx.response)

})

app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => { console.log('App is running')});
