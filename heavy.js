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

var priorities = cycle( ['low','low','critical' ] )
console.log( 'sending %s heavy jobs', limit);
var id = setInterval( function(){
    if( ++current >= limit ){
        clearInterval( id );
    }

    var level = priorities.next()
    var  heavy = queue.create('heavy',{
       title:level + ' heavy job' + crypto.createHash('md5').update( crypto.randomBytes( 10 ) ).digest('hex')
       ,north: true
       ,south:false
       ,west: true
       ,east:true
    }).save( function( err ){
        if( !err ){
        }
    })

    heavy.on('complete', function( result ){
        console.log("job complete", result );
    }).on('progress',function(progress, data){
        console.log('progress', progress);
        heavy.log('progress event', data )
    })
    heavy.attempts(3).priority( level ).save();
}, 2000 )
