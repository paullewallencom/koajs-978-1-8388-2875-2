/*const Koa = require('koa');
const KoaRouter = require('koa-router');*/

import Koa from 'koa';
import KoaRouter from 'koa-router';
import '@babel/polyfill';
import bodyParser from 'koa-bodyparser';
import mongo from 'koa-mongo';


const port = 3670;
const app = new Koa();
const router = new KoaRouter();

//Use as middleware
app.use(bodyParser());
app.use(mongo({
    host: 'localhost',
    port: 27017,
    db: 'userlist'
}))


//userlist
var data = [
    {"id":1,"name":"John"},
    {"id":2,"name":"Alis"},
]

router.get('/', read);
router.post('/add', add);
router.put('/update', update);
router.delete('/delete', deletedata);




async function read(ctx,next){
    ctx.body = await ctx.db.collection('userlist').find().toArray()
}

async function add(ctx){
    var uin = ctx.request.body;
    data.push(uin)
    ctx.body = "Data Added"
}

async function update(ctx){
    let uin = ctx.request.body;
    const index = data.findIndex((e) => e.id === uin.id)
    let message;
    if( index === -1){
        data.push(uin)
        message = "Data Added"
    } else {
        data[index] = uin;
        message= "data updated"
    }

    ctx.body = message
}

async function deletedata(ctx){
    let uin = ctx.request.body;
    const index = data.findIndex((e) => e.id === uin.id)
    let message;
    if( index === -1){
        message = "Data Not Found"
    } else {
        delete data[index];
        message= "data deleted"
    }

    ctx.body = message
}


app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => { console.log('App is running')});
