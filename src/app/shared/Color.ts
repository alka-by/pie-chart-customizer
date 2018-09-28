export class Color {
  base: string;
  emissive: string;
  transparent: string;

  constructor(base: string, emissive: string, transparent: string) {
    this.base = base;
    this.emissive = emissive;
    this.transparent = transparent;
  }
}
