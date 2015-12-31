
var kue = require('kue');
var  app = require('express')();

var debug = require('debug')('failed:' + process.pid)
var queue = kue.createQueue({
    redis:{
        db:3
    }
});
queue.process('failed', function( j, done ){
    var e = new Error(util.format("job %s fialed", j.id ) );
    e.name = 'BrokenError';
    done( e );
})

