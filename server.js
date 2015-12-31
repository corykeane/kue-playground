'use strict';
var kue = require('kue');
var cluster = require('cluster');
var os = require('os')
if( cluster.isMaster ){
    for(let x=0, len = os.cpus().length; x<len; x++){
        cluster.fork()
    }
}else{
    kue.createQueue({redis:{db:3}})
    kue.app.listen( 3000 );
    console.log("worker %s started", process.pid )
}


