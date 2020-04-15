const moment = require('moment');

console.log('Hello World!');

console.log('Moment format:', moment().format());

var time_now = moment().format(); 

setTimeout(()=>{
    var timeago = moment(time_now).fromNow();
    console.log('Time ago: ', timeago);
    console.log('TypeOf:', typeof time_now);
    
} , 5000);