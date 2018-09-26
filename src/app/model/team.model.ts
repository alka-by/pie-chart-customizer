export class Team {

  constructor(
    public name: string,
    public wins: number
  ) { }

  getName() {
    return this.name;
  }

  getWins() {
    return this.wins;
  }
}