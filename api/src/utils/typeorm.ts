import { Document, Model } from 'mongoose';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';

export const findEntityOrThrow = async <T extends Document>(
  Model: Model<T>,
  id: string,
): Promise<T> => {
  const instance = await Model.findById(id);
  if (!instance) {
    throw new EntityNotFoundError(Model.modelName);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends Document>(instance: T): Promise<T> => {
  if ('validations' in instance.constructor) {
    const errorFields = generateErrors(instance, (instance.constructor as any).validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return instance.save();
};

export const createEntity = async <T extends Document>(
  Model: Model<T>,
  input: Partial<T>,
): Promise<T> => {
  const instance = new Model(input);
  return validateAndSaveEntity(instance);
};

export const updateEntity = async <T extends Document>(
  Model: Model<T>,
  id: string,
  input: Partial<T>,
): Promise<T> => {
  const instance = await findEntityOrThrow(Model, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance);
};

export const deleteEntity = async <T extends Document>(
  Model: Model<T>,
  id: string,
): Promise<T> => {
  const instance = await findEntityOrThrow(Model, id);
  await instance.deleteOne();
  return instance;
};
