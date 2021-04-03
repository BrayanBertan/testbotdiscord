

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


  async function getMainData(nick){
    const mainId = await prisma.user.findFirst({
      where:{
          nick:nick,
      },
    });
   return mainId;
  }

  async function getAlts(nick){
    const allAlts = await prisma.user.findFirst({
      where:{
          nick:nick,
      },
      include: {
      alts:true
      },
    });
   return allAlts;
  }

  async  function setAlt(mainId,nick){
    await prisma.alt.create({
     data:{
       nick:nick,
       mainId:mainId.id
     }
   });
   }

   async function setManyAlts(nicks){
    const createMany = await prisma.alt.createMany({
      data: nicks,
      skipDuplicates: true,
    })
   }

   async function unsetAlt(nick){
    const unsetedAlt = await prisma.alt.deleteMany({
      where: {
      nick: nick,
      },
    })
    return unsetedAlt;
   }

   async function deleteUser(main){
  
    const deletedAlts =  prisma.alt.deleteMany({
      where: {
        mainId: main.id,
      },
    })
    const deletedUser = prisma.user.delete({
      where: {
        id: main.id,
      },
    })
    const transaction =  prisma.$transaction([deletedAlts, deletedUser])
    return transaction;
   }

  var contentArray = msg.content.trim().split(' ');
  var command = contentArray[0];
  if(command != 'create' && command != 'get' &&  command != 'set' &&  command != 'unset' &&   command != 'delete' ) return;
  if(contentArray.length == 1) return msg.reply('Invalid Command! missing params!');
  var param1 = contentArray[1].toUpperCase();

  if (command === 'create') {
    getMainData(param1).then(function(main){
      if(main != null) return msg.reply('Main already registered!');
      createMain(param1).then(function(value){
        msg.reply('Main '+ param1+' created!');
      },
      function(error){
        msg.reply('Error');
      });
    },
    function(error){
      msg.reply('Error');
    });


  
  }
  if (command === 'get') {
    getAlts(param1).then(function(value) {
     if(value == null) return msg.reply(param1+' doesnt exists!');
     var result = value.alts.map((value, index) => value['nick'] );
     msg.reply(param1+' alts: '+JSON.stringify(result));
    }, function(error) {
      msg.reply('Error');
    });
  }

  if(command === 'unset'){
    unsetAlt(param1).then(function(alt) {
      msg.reply(param1+' alt deleted');
     }, function(error) {
       msg.reply('Error unsetAlt');
       console.log(error);
     });
  }

  if(command === 'delete'){
    getMainData(param1).then(function(main){
      if(main == null) return msg.reply(param1+' doesnt exists!');
        deleteUser(main).then(function(value) {
        msg.reply(param1+' and ALL alts deleted');
      }, function(error) {
        msg.reply('Error deleteUser');
        console.log(error);
      });
      },
    function(error){
      msg.reply('Error getMainData');
      console.log(error);
    });
  }

  
  if(command === 'set'){
    if(contentArray.length < 3) return msg.reply('Invalid Command! missing params!');
      var param2 = contentArray[2].toUpperCase();
    getMainData(param1).then(function(main){
      if(main == null) return msg.reply(param1+' doesnt exists!');
      var altsArray = param2.trim().split(',');
      if(altsArray.length == 1){
        setAlt(main,param2).then(function(value){
          msg.reply('Alt '+param2+ ' created for Main '+ param1);
        },
        function(error){
          msg.reply('Error setAlt');
        });
      }else{
        var allAlts = [];
        altsArray.forEach(item => allAlts.push({nick:item, mainId:main.id}));
        setManyAlts(allAlts).then(function(value){
          msg.reply('Alts '+altsArray+ ' created for Main '+ param1);
        },
        function(error){
          msg.reply('Error setManyAlts');
        });
      }
      
    },
    function(error){
      msg.reply('Error getMainData');
    });
  }
});

client.login('ODI3MjE4NTg4MDI4ODk1Mjcy.YGX1WA.kfWzEAWbnYoUIK3_UGCjLkVzxDc');