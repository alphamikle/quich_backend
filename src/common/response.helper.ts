export class ResponseWrapper<T> {
  private response = {
    payload: {},
    message: '',
  };

  constructor(payload: T, message: string = '') {
    this.response.payload = payload;
    this.response.message = message;
  }
}
