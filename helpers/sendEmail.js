import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY, MAIL_FROM } = process.env;

const sendEmail = async (data) => {
  const msg = { ...data, from: MAIL_FROM };
  try {
    const resp = await sgMail.setApiKey(SENDGRID_API_KEY).send(msg);
    console.log(resp[0].statusCode, "Email successfuly sent");
  } catch (error) {
    console.log(resp.statusCode);
    console.log(error.response.body);
  }
};

export default sendEmail;
