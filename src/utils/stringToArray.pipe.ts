import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber, isString, isUUID } from 'class-validator';

interface IRequireOption {
  isNumber?: boolean;
  isRequired?: boolean;
  isString?: boolean;
  isUUID?: boolean;
}

@Injectable()
export class StringToArrayPipe implements PipeTransform<string, string[]> {
  constructor(
    private readonly delimiter: string = ',',
    private readonly requireOption: IRequireOption = {
      isNumber: false,
      isRequired: false,
      isString: false,
      isUUID: false,
    },
  ) {}

  transform(value: string): string[] {
    if (!value) return [];

    const array = value.split(this.delimiter);

    if (this.requireOption.isRequired && array.some((item) => !item)) {
      throw new BadRequestException('One or more items are not valid');
    }

    if (this.requireOption.isNumber && array.some((item) => !isNumber(item))) {
      throw new BadRequestException('One or more items are not numbers');
    }

    if (this.requireOption.isString && array.some((item) => !isString(item))) {
      throw new BadRequestException('One or more items are not strings');
    }

    if (this.requireOption.isUUID && array.some((item) => !isUUID(item))) {
      throw new BadRequestException('One or more items are not valid UUIDs');
    }

    return array;
  }
}
