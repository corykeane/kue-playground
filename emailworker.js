var kue = require('kue');
var  app = require('express')();
var debug = require('debug')('emaiworker:' + process.pid)

var queue = kue.createQueue({
    redis:{
        db:3
    }
});
debug( 'email worker handling 5 messages');

queue.process('email', 5 , function( j, done ){
    var frame = 0
    var id = setInterval(function(){
        frame +=10
        if(frame >= 100 ){
            clearInterval( id );
            done();
        }
        debug('job %s progress %s', j.id, frame);       
        j.progress( frame, 100, Math.random() );

    },500)
});

