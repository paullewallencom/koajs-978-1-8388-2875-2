import Koa from 'koa';
import KoaRouter from 'koa-router';
import '@babel/polyfill';
import bodyParser from 'koa-bodyparser';
import mongo from 'koa-mongo';
import path from 'path';
import render from 'koa-ejs'

const port = 3670;
const app = new Koa();
const router = new KoaRouter();

//Use as middleware
app.use(bodyParser());
app.use(mongo({
    host: 'localhost',
    port: 27017,
    db: 'koadb'
}))

render(app,{
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache:false,
    debug:false
})

router.post('/add', add);
router.get('/',read);
router.put('/update', update);
router.delete('/delete', deletedata)


async function add(ctx){
    var uin = ctx.request.body;
    await ctx.db.collection('userlist').insert(uin);
    ctx.body = "Data Added"
}

async function read(ctx){
     ctx.body = await ctx.db.collection('hotels').find().toArray();
}

async function update(ctx){
    var uin = ctx.request.body;
    await ctx.db.collection('userlist').findOneAndUpdate({"id":uin.id},{
        $set:{
            name: uin.name,
            subject: uin.subject,
            age: uin.age
        }
    },{
        upsert:true
    })

    ctx.body= "data update"
}

async function deletedata(ctx){
    var uin = ctx.request.body;
    ctx.db.collection('userlist').findOneAndDelete({
        "name":uin.name
    })

    ctx.body="Data Deleted"
}



app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => { console.log('App is running')});
