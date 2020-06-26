const emailService = require("./emailService")

const queryTest = async () => {
    const emailServiceInstance = new emailService();

    const subs = await emailServiceInstance.sendUpdateEmail("erinc.polat@gmail.com");

    return subs;
}

queryTest().then(subs => console.log("subs"))