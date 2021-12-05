const Joi = require("joi");

const registerInputValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .required()
      .min(8)
      .max(15)
      .message('"Password" should contain 8 to 15 characters')
      .label("Password"),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).send(error.details.map((err) => err.message));
    return;
  }
  next();
};

module.exports = { registerInputValidation };
