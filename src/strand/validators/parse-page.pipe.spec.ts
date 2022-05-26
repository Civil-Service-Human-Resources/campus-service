import { ParsePagePipe } from './parse-page.pipe';

describe('ParsePagePipe', () => {
  const parser = new ParsePagePipe();

  it('Should return 1 when an invalid number is passed in', async () => {
    const res = await parser.transform('hello', null);
    expect(res).toEqual(1);
  });

  it('Should return 1 when a negative number is passed in', async () => {
    const res = await parser.transform(-1, null);
    expect(res).toEqual(1);
  });

  it('Should return 1 when a 0 is passed in', async () => {
    const res = await parser.transform(0, null);
    expect(res).toEqual(1);
  });
});
