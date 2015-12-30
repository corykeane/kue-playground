var kue = require('kue');
var crypto = require('crypto');

var queue = kue.createQueue({
    redis:{
        db:3
    }
});
setInterval( function(){
    console.log( 'starting new job ');

    var jobs = queue.create('email',{
        to:'foo@mail.com'
       ,title:'email job ' + Math.random()
       ,from:'test@mail.com'
       ,subject:'this is a test'
       ,body:'hello world'
    }).save( function( err ){
        if( !err ){
        }
    })

    jobs.on('complete', function( result ){
        console.log("job complete", result );
    }).on('progress',function(progress, data){
        console.log('progress', progress);
        jobs.log('progress event', data )
    })


    jobs.attempts(3).save();

}, 500 )
setInterval( function(){
    console.log( 'starting new job ');

    var  heavy = queue.create('heavy',{
       title:'heavy job' + crypto.createHash('md5').update( crypto.randomBytes( 10 ) ).digest('hex')
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


    heavy.attempts(3).save();

}, 2000 )


setTimeout( function(){

    var  failed = queue.create('failed',{
       title:'failed job' + crypto.createHash('md5').update( crypto.randomBytes( 10 ) ).digest('hex')
    }).save( function( err ){
        if( !err ){
        }
    })

    failed.attempts(3).save();

}, 1000 )


