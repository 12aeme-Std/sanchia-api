import Joi from 'joi';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

export const createCategorySchema = Joi.object<CreateCategoryDto>({
    name: Joi.string().required(),
});

export const updateCategorySchema = Joi.object<UpdateCategoryDto>({
    name: Joi.string().required(),
});
