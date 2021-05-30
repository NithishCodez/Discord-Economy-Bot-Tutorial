const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const jsoning = require("jsoning");
const database = new jsoning("bank.json");
const prefix = "-";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "balance") {
    var data = await database.get(message.author.id);
    if (!data)
      data = {
        wallet: 0,
        bank: 0,
      };

    message.channel.send(
      new MessageEmbed()
        .setTitle(message.author.username + "'s Balance")
        .setColor("BLUE")
        .setDescription(
          `
Wallet: • ${data.wallet}
Bank: • ${data.bank}
      `
        )
        .setTimestamp()
    );
  }

  if (command === "beg") {
    var data = await database.get(message.author.id);
    if (!data)
      data = {
        wallet: 0,
        bank: 0,
      };
    const amount = Math.floor(Math.random() * Math.floor(500));
    await database.set(message.author.id, {
      wallet: data.wallet + amount,
      bank: data.bank,
    });
    const outcomes = ["Wumpus", "Your Mom", "Rick Astley", "Trump"];
    message.channel.send(
      new MessageEmbed()
        .setDescription(
          `
${
  outcomes[Math.floor(Math.random() * Math.floor(outcomes.length))]
} Gave You **${amount}** Coins
          `
        )
        .setColor("GREEN")
    );
  }

  if (command == "deposit") {
    var data = await database.get(message.author.id);
    if (!data)
      data = {
        wallet: 0,
        bank: 0,
      };
    if (isNaN(args[0])) return message.channel.send("Only Numbers are allowed");
    if (parseInt(args[0]) > data.wallet) return message.channel.send("You don't Have That much in your wallet!");

    database.set(message.author.id, {
      wallet: data.wallet - parseInt(args[0]),
      bank: data.bank + parseInt(args[0]),
    });

    message.channel.send(
      new MessageEmbed().setDescription(`
Deposited **${args[0]}** Into Bank
          `)
    );
  }

  if (command == "withdraw") {
    var data = await database.get(message.author.id);
    if (!data)
      data = {
        wallet: 0,
        bank: 0,
      };
    if (isNaN(args[0])) return message.channel.send("Only Numbers are allowed");
    if (parseInt(args[0]) > data.bank) return message.channel.send("You don't Have That much in your bank!");

    database.set(message.author.id, {
      wallet: data.wallet + parseInt(args[0]),
      bank: data.bank - parseInt(args[0]),
    });

    message.channel.send(
      new MessageEmbed().setDescription(`
Withdrew **${args[0]}** Into Bank
          `)
    );
  }

});

client.login("");
