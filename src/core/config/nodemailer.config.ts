import nodeMailer from 'nodemailer';


export const mailer = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
        user: "moussaouifilm16@gmail.com",
        pass: "bncdqprsssfandhw"
    }
});
