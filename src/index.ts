import { Telegraf } from "telegraf";
import { beginCell, toNano } from "ton-core";
import dotenv from "dotenv"
import qs from "qs";
dotenv.config();
const bot = new Telegraf(process.env.TG_BOT_TOKEN!);
bot.hears("Increment by 1", (ctx) => {
    // TODO: send increment transaction
    const msg_body = beginCell()
        .storeUint(1, 32)
        .storeUint(1, 32)
        .endCell();

    let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
        text: "Simple test transaction",
        amount: toNano("0.05").toString(10),
        bin: msg_body.toBoc({ idx: false }).toString("base64"),
    })}`
    ctx.reply("To increment counter by 1, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
    });
});
bot.hears("Deposit 1 TON", (ctx) => {
    const msg_body = beginCell().storeUint(2, 32).endCell();
    let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS
        }?${qs.stringify(
            {
                text: "Deposit 1 TON",
                amount: toNano("1").toString(10),
                bin: msg_body.toBoc({ idx: false }).toString("base64"),
            }
        )}`;
    ctx.reply("To Deposit 1 TON, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
    });
});

bot.hears("Withdraw 1 TON", (ctx) => {
    // TODO: send withdraw transaction
    const msg_body = beginCell().storeUint(3, 32).storeCoins(toNano(1)).endCell();
    let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS
        }?${qs.stringify(
            {
                text: "Withdraw 1 TON",
                amount: toNano('0.05').toString(10),
                bin: msg_body.toBoc({ idx: false }).toString("base64"),
            }
        )}`;
    ctx.reply("To Withdraw 1 TON, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
    });
});

bot.start((ctx) =>
    ctx.reply("Welcome to our counter app!", {
        reply_markup: {
            keyboard: [
                ["Increment by 1"],
                ["Deposit 1 TON"],
                ["Withdraw 1 TON"],
            ],
        },
    })

);


bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));