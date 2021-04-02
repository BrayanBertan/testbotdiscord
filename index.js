

const express = require('express');
const app = express();
const port = 3000;


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  async  function createMain(nick){
   // msg.reply('pong!'+a);
   await prisma.user.create({
    data:{
      nick:nick
    }
  });
  }

  var contentArray = msg.content.split(' ');
  var command = contentArray[0];

  if (command === 'create') {
    console.log(contentArray[1]);
    createMain(contentArray[1]);
     console.log('done');
  }
  if (msg.content === 'test') {
    setTimeout(teste, 5000);
  
  }
});

client.login('ODI3MjE4NTg4MDI4ODk1Mjcy.YGX1WA.kfWzEAWbnYoUIK3_UGCjLkVzxDc');