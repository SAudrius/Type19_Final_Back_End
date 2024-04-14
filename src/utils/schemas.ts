import Joi from 'joi';

export const postClassifiedAdSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  phone: Joi.number().required(),
  type: Joi.string().required(),
  town: Joi.number().required(),
  user_id: Joi.number().required(),
  category: Joi.number().required(),
  image_main: Joi.string().required(),
  image_1: Joi.string().required(),
  image_2: Joi.string().required(),
  image_3: Joi.string().required(),
  image_4: Joi.string().required(),
  isPublished: Joi.number().required(),
});
