var mystring = 'http://localhost:3000/chat.html?name=Vijay&room=Hey';
mystring = mystring.split('?name=Vijay').join('')
console.log(mystring);
