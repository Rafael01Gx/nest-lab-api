export interface ISendMail<T> {
  to: string;
  subject: string;
  data: T;
  htmlFunction: (data: T) => string;
}
