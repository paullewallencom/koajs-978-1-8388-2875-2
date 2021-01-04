import Koa from 'koa'
import '@babel/polyfill';
import jwt from 'koa-jwt'
import logger from 'koa-logger';
const router = require('koa-router')();
import koaBody from 'koa-body';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = process.env.JWT_SECRET || 'jwt_super_secret';

const app = new Koa();
const users = [];

// Custom 401 handling
app.use(async function (ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      let errMessage = err.originalError ?
        err.originalError.message :
        err.message
      ctx.body = {
        error: errMessage
      };
      ctx.set("X-Status-Reason", errMessage)
    } else {
      throw err;
    }
  });
});

app.use(jwt({
  secret: secret
}).unless({
  path: [/^\/koa/, "/"]
}));

app.use(async(ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


if (process.env.NODE_ENV != 'test') {
  app.use(logger());
}
app.use(koaBody());

router.get('/', async(ctx) => {
  ctx.body = 'Hello';
});

/**
 * You can register with:
 * curl -X POST --data '{"username":"admin", "password":"koa", "email":"admin@koa.com", "name":"John"}' http://localhost:9000/koa/register
 */
router.post('/koa/register', async(ctx, next) => {
  if (!ctx.request.body.username || !ctx.request.body.password || !ctx.request.body.email || !ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      error: 'expected an object with username, password, email, name but got: ' + ctx.request.body
    }
    return;
  }

  ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 5);;
  const user = getUserByUsername(ctx.request.body.username, users);
  if (!user) {
    users.push(ctx.request.body);
    ctx.status = 200;
    ctx.body = {
      message: "success"
    };
    next();
  } else {
    ctx.status = 406;
    ctx.body = {
      error: "User exists"
    }
    return;
  }
});

/**
 * You can login with:
 * curl -X POST -H "Content-Type: application/json" --data '{"username":"admin", "password":"koa"}' http://localhost:9000/koa/login
 */
router.post('/koa/login', async(ctx, next) => {

  let user = await getUserByUsername(ctx.request.body.username, users);
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      error: "bad username"
    }
    return;
  }
  const {
    password,
    ...userInfoWithoutPassword
  } = user;
  if (await bcrypt.compare(ctx.request.body.password, password)) {
    ctx.body = {
      token: jsonwebtoken.sign({
        data: userInfoWithoutPassword,
        //exp in seconds
        //exp: Math.floor(Date.now() / 1000) - (60 * 60) // 60 seconds * 60 minutes = 1 hour
      }, secret)
    }
    next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: "bad password"
    }
    return;
  }
});

function getUserByUsername(username, users) {
  let user;
  for (let i = 0; i < users.length; i++) {
    user = users[i];
    if (user.username === username) {
      return user;
    }
  }
  return null;
}

/**
 * After you login and get a token you can access
 * this (and any other non koa endpoint) with:
 * curl -X GET -H "Authorization: Bearer INSERT_TOKEN_HERE" http://localhost:9000/profile
 */
router.get('/profile', async(ctx) => {
  ctx.body = 'Welcome ' + ctx.state.user.data.name
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;