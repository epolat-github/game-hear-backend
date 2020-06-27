const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const subscriberModel = require("../models/subscribers");

class emailService {
    constructor() {}

    async sendWelcomeEmail({ email }) {}

    formatGameNames(gameName) {
        switch (gameName) {
            case "gta5":
                return "GTA5: Online";
            case "valorant":
                return "Valorant";
            case "lol":
                return "League of Legends";
            default:
                console.log("Unknown game");
        }
    }

    async sendUpdateEmail(gameName) {
        let emails = await subscriberModel
            .find({ games: gameName })
            .select({ email: 1, _id: 0 });

        if (emails.length == 0) {
            return console.log(`No subscribers on ${gameName}`);
        } else {
            // extract email strings from mongoose objects
            emails = emails.map((email) => email.email);
            console.log(`Found users for ${gameName}: `, emails);
        }

        gameName = this.formatGameNames(gameName);

        const transporterConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        };

        const transporter = nodemailer.createTransport(transporterConfig);

        emails.forEach(async (email) => {
            const mailToSend = this.createMail(
                email,
                `https://game-hear-web.herokuapp.com/games`,
                gameName
            );

            // doesn't support async, await
            transporter.sendMail(mailToSend, (err, info) => {
                if (err) {
                    console.error(
                        `Error while sending email to ${email}: `,
                        err.message
                    );
                } else {
                    console.log(`Sent email to ${email}: `, info.messageId);
                }
            });
        });
    }

    createMail(email, link, gameName) {
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "GameHear",
                link: "https://game-hear-web.herokuapp.com/",
                //logo can come here
                // logo: "link"
            },
        });

        const emailContent = {
            body: {
                intro: `Hello ${gameName} has new updates`,
                action: {
                    instructions:
                        "To learn about the latest update, click here:",
                    button: {
                        color: "#22BC66", // Optional action button color
                        text: "Keep Up!!!",
                        link: link,
                    },
                },
                outro:
                    "Need help, or have questions? Just go to the Support Section, we'd love to help.",
            },
        };

        const emailHtml = mailGenerator.generate(emailContent);
        const emailText = mailGenerator.generatePlaintext(emailContent);

        const mailToSend = {
            from: "etuna1999@gmail.com",
            to: email,
            subject: `${gameName} Update`,
            html: emailHtml,
            text: emailText,
        };

        return mailToSend;
    }

    async cancelSubscription() {}
}

module.exports = emailService;
