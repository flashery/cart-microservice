export class Answer {
  constructor(
    public questionId: string,
    public answerId: string,
    public userAnswer: string,
    public question: string
  ) {}
}
