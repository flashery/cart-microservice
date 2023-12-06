export class Question {
  constructor(
    public name: string,
    public answerType: string,
    public displayText: string,
    public dropdownOptions: string[]
  ) {}
}
