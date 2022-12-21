import { calculateScoring } from './ciblage';
import { menages } from './menages';

menages.forEach((menage) => {
  test('is correct', () => {
    expect(calculateScoring(menage)).toBe(menage.Score);
  });
});
