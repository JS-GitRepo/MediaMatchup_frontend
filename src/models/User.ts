export default interface User {
  _id?: string;
  uid: string;
  name: string;
  email: string;
  friends?: [{}];
  favorites?: [{}];
}
