var kue = require('kue');
var  app = require('express')();

var queue = kue.createQueue({
    redis:{
        db:3
    }
});
app.use( kue.app );
app.listen( 3000 );

