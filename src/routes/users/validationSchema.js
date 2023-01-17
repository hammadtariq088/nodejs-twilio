const Joi = require("joi");

const createUserSchema = (user) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(20).required(),
    password: Joi.string().alphanum().min(8).max(15).required(),
  });

  return schema.validate(user);
};

module.exports = createUserSchema;
