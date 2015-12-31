var kue = require('kue');
var crypto = require('crypto');
var limit = ~~( process.argv[2] || 10 );
var current = 0;
var queue = kue.createQueue({
    redis:{
        db:3
    }
});
console.log( 'sending %s failed jobs', limit);

setTimeout( function(){

    var  failed = queue.create('failed',{
       title:'failed job' + crypto.createHash('md5').update( crypto.randomBytes( 10 ) ).digest('hex')
    }).save( function( err ){
        if( !err ){
        }
    })

    failed.attempts(3).save();

}, 1000 )

