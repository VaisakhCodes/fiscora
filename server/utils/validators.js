const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().max(50).allow('', null)
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const expenseSchema = Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().max(255).required(),
    category: Joi.string().required(),
    date: Joi.date().iso().required()
});

module.exports = {
    registerSchema,
    loginSchema,
    expenseSchema
};
