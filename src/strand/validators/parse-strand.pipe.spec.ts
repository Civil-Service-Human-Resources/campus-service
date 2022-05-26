import { BadRequestException } from '@nestjs/common';
import { ParseStrandPipe } from './parse-strand.pipe';

describe('ParseStrandPipe', () => {
  const parser = new ParseStrandPipe();

  it('Should not throw an exception when a valid strand is passed in', async () => {
    const res = await parser.transform(1, null);
    expect(res).toEqual(1);
  });

  it('Should throw an exception when an invalid strand is passed in', async () => {
    await expect(parser.transform(6, null)).rejects.toEqual(
      new BadRequestException('invalid strand supplied'),
    );
  });

  it('Should throw an exception when an invalid number is passed in', async () => {
    await expect(parser.transform('hello', null)).rejects.toEqual(
      new BadRequestException('invalid strand supplied'),
    );
  });
});
