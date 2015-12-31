var kue = require('kue');
var  app = require('express')();

var queue = kue.createQueue({
    redis:{
        db:3
    }
});
app.use( kue.app );
app.listen( 3000 );

setTimeout(function(){
    console.log( 'starting jobs')
    queue.process('email', 5 , function( j, done ){
        var frame = 0
        var id = setInterval(function(){
            frame +=10
            if(frame >= 100 ){
                clearInterval( id );
                done();
            }

            j.progress( frame, 100, Math.random() );

        },500)
    });


    queue.process('heavy', 2 , function( j, done ){
        var frame = 0
        var id = setInterval(function(){
            frame +=10
            if(frame >= 1000 ){
                clearInterval( id );
                done();
            }

            j.progress( frame, 1000, Math.random() );

        },500)
    });


    queue.process('failed', function( j, done ){
        var e = new Error( "Something went bad, Fix it" );
        e.name = 'BrokenError';

        done( e );
    })
},5000)

