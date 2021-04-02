const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var a = 0;
  function teste(){
    msg.reply('pong!'+a);
    a++;
  }
  if (msg.content === 'ping') {
    setTimeout(teste, 3000);
  
  }
});
// You really don't want your token here since your repl's code
// is publically available. We'll take advantage of a Repl.it 
// feature to hide the token we got earlier. 
client.login('ODI3MjE4NTg4MDI4ODk1Mjcy.YGX1WA.kfWzEAWbnYoUIK3_UGCjLkVzxDc');