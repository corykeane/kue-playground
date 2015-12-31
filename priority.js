var kue = require('kue');
var crypto = require('crypto');
var limit = ~~( process.argv[2] || 10 );
var current = 0;
var queue = kue.createQueue({
    redis:{
        db:3
    }
});
console.log( 'sending %s priority jobs', limit);

var id = setInterval( function(){
    if( ++current >= limit ){
        clearInterval( id );
    }
    var priority = queue.create('priority',{
        a:1, b:2, c:3, d:4, e:6, title:'uber important thing!'
    }).save( function( err ){
        if( err ){
            console.log( err );
            process.exit( 1 );
        }
    })
    priority.on('complete', function( result ){
        console.log("prioirty job  %s complete", priority.id, result );
    }).on('progress',function(progress, data){
        console.log('progress', progress);
        priority.log('progress event', data )
    })
    priority.priority('critical').attempts(5).save();
}, 500 )
