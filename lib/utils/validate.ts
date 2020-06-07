/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validator } from 'jsonschema';

export function validate(request: any, schema: any): void {
  if(!request.body) {
    throw new Error('Empty body');
  }

  const validatorResult = new Validator().validate(request.body, schema);

  if (validatorResult.errors.length > 0) {
    throw new Error(validatorResult.errors.join(', '));
  }
}

module.exports = {
  validate
};
