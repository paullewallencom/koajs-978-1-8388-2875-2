var koa = require('koa');
var app = new koa();

//Order of middlewares
app.use(first);
app.use(second);
app.use(third);

function *first(next) {
   console.log("I'll be logged first. ");
   
   //Now we yield to the next middleware
   yield next;
   
   //We'll come back here at the end after all other middlewares have ended
   console.log("I'll be logged last. ");
};

function *second(next) {
   console.log("I'll be logged second. ");
   yield next;
   console.log("I'll be logged fifth. ");
};

function *third(next) {
   console.log("I'll be logged third. ");
   yield next;
   console.log("I'll be logged fourth. ");
};

app.listen(3000);