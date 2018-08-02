// const moment = require('moment');
//
// // var date = moment();
// // date.subtract(100, 'year').add(100, 'year');
// // console.log(date.format('MMM Do YYYY'));
//
// var date = moment();
// console.log(date.format('h:mm a'));

var mystring = 'http://localhost:3000/chat.html?name=Vijay&room=Hey';
mystring = mystring.split('?name=Vijay').join('')
console.log(mystring);
