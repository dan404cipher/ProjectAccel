import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ObjectLiteral } from 'typeorm';

import { Project, User, Issue, Comment } from 'entities';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';

type EntityConstructor = (new (...args: any[]) => ObjectLiteral);
type EntityInstance = ObjectLiteral;

const entities: { [key: string]: EntityConstructor } = { Comment, Issue, Project, User };

export const findEntityOrThrow = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  options?: FindOneOptions,
): Promise<InstanceType<T>> => {
  const instance = await (Constructor as any).findOne(id, options);
  if (!instance) {
    throw new EntityNotFoundError((Constructor as any).name);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(instance: T): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if (Constructor && 'validations' in Constructor) {
    const errorFields = generateErrors(instance, (Constructor as any).validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return (instance as any).save() as Promise<T>;
};

export const createEntity = async <T extends EntityConstructor>(
  Constructor: T,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = (Constructor as any).create(input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance);
};

export const deleteEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  await instance.remove();
  return instance;
};
