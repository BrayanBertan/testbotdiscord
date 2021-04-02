

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
   await prisma.user.create({
    data:{
      nick:nick
    }
  });
  }

  async function getAllAlts(){
    const allUsers = await prisma.user.findMany({
      include: {
      alts:true
      },
    });
   return allUsers;
  }

  var contentArray = msg.content.trim().split(' ');
  var command = contentArray[0];
  if(contentArray.length == 1) return msg.reply('Invalid Command! missing params!');

  if (command === 'create') {
    createMain(contentArray[1].toUpperCase());
    msg.reply('Main '+ contentArray[1]+' created!');
  }
  if (command === 'get') {
    msg.reply(getAllAlts());
  }
});

client.login('ODI3MjE4NTg4MDI4ODk1Mjcy.YGX1WA.kfWzEAWbnYoUIK3_UGCjLkVzxDc');