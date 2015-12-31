var kue = require('kue');
var crypto = require('crypto');
var limit = ~~( process.argv[2] || 10 );
var current = 0;
var queue = kue.createQueue({
    redis:{
        db:3
    }
});

function cycle( arr ){
    var idx = 0;
    return {
        next: function(){
            return arr[idx++ % arr.length ]
        }
    }
}

var priorities = cycle( ['low','low','low','low', 'low','critical' ] )
console.log( 'sending %s email jobs', limit);

var id = setInterval( function(){
    if( ++current >= limit ){
        clearInterval( id );
    }

    var level = priorities.next()
    var email = queue.create('email',{
        to:'foo@mail.com'
       ,title:'email job ' + level
       ,from:'test@mail.com'
       ,subject:'this is a test'
       ,body:'hello world'
    }).save( function( err ){
        if( err ){
            console.log( err );
            process.exit( 1 );
        }
    })

    email.on('complete', function( result ){
        console.log("job complete", result );
    }).on('progress',function(progress, data){
        console.log('progress', progress);
        email.log('progress event', data )
    })

    
    email.priority( level ).save();
    
}, 500 )
