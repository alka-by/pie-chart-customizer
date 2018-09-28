import { Color } from './Color';

export class ColorsService {
  private colors: Color[] = [
    new Color('rgb(255,182,193)', 'rgb(225,152,163)', 'rgba(255,182,193, 0.75)'),
    new Color('rgb(147,112,219)', 'rgb(117,82,189)', 'rgba(147,112,219, 0.75)'),
    new Color('rgb(255,160,122)', 'rgb(225,130,92)', 'rgba(255,160,122, 0.75)'),
    new Color('rgb(102,205,170)', 'rgb(72,175,140)', 'rgba(102,205,170, 0.75)'),
    new Color('rgb(135,206,250)', 'rgb(105,176,220)', 'rgba(135,206,250, 0.75)'),
    new Color('rgb(32,178,170)', 'rgb(2,148,140)', 'rgba(32,178,170, 0.75)')
  ];

  getColors() {
    return this.colors;
  }
}
