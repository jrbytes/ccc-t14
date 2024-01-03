export default class Email {
  constructor(readonly value: string) {
    if (this.isInvalidEmail(value)) throw new Error("Invalid email");
  }

  private isInvalidEmail (email: string) {
		return !email.match(/^(.+)@(.+)$/);
	}
}