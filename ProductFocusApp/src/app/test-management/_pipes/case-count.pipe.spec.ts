import { CaseCountPipe } from './case-count.pipe';

describe('CaseCountPipe', () => {
  it('create an instance', () => {
    const pipe = new CaseCountPipe();
    expect(pipe).toBeTruthy();
  });
});
