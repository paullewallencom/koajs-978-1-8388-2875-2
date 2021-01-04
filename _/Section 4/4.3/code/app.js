import Koa from 'koa';
import KoaRouter from 'koa-router';
import '@babel/polyfill';
import bodyParser from 'koa-bodyparser';
import mongo from 'koa-mongo';
import  mongoose from 'koa-mongoose'


const port = 3670;
const app = new Koa();
const router = new KoaRouter();

//Use as middleware
app.use(bodyParser());
/*app.use(mongo({
    host: 'localhost',
    port: 27017,
    db: 'koadb'
}))*/
app.use(mongoose({
    username: '',
    password: '',
    host: '127.0.0.1',
    port: 27017,
    database: 'koadb',
    schemas: './schemas'
}))

router.get('/',read);

async function read(ctx){
    ctx.body = await ctx.User.find().toArray()
}

app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => { console.log('App is running')});
