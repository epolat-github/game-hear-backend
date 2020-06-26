const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const subscriberModel = require("../models/subscribers");

class emailService {
    constructor() {}

    async sendWelcomeEmail({ email }) {}

    async sendUpdateEmail(gameName) {
        const emails = await subscriberModel
            .find({ games: gameName })
            .select("email");

        if (emails.length == 0) {
            return console.log(`No subscribers on ${gameName}`);
        }
        
        const transporterConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        };

        const transporter = nodemailer.createTransport(transporterConfig);

        emails.forEach((email) => {
            const mailToSend = this.createMail(
                email,
                `https://game-hear-web.herokuapp.com/games`,
                gameName
            );
            
            const result = await transporter.sendMail(mailToSend);
            return result;
        });
    }

    createMail(email, link, games) {
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "GameHear",
                link: "https://google.com",
                //logo can come here
                // logo: "link"
            },
        });

        const emailContent = {
            body: {
                intro: `Hello ${games[0]} has new updates`,
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
            from: "no-reply@gamehear.com",
            to: email,
            subject: `${games[0]} Update`,
            html: emailHtml,
            text: emailText,
        };

        return mailToSend;
    }

    async cancelSubscription() {}
}

module.exports = emailService;
