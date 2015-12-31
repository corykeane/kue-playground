var kue = require('kue');
var  app = require('express')();

var debug = require('debug')('heavyworker:' + process.pid)
var queue = kue.createQueue({
    redis:{
        db:3
    }
});
queue.process('heavy', 2 , function( j, done ){
    var frame = 0
    var id = setInterval(function(){
        frame +=10
        if(frame >= 1000 ){
            clearInterval( id );
            done();
        }
        debug('job %s progress %s', j.id, frame);
        j.progress( frame, 1000, Math.random() );

    },500)
});

