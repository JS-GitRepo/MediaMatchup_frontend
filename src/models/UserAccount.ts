export default interface UserAccount {
  _id?: string;
  uid: string;
  name: string;
  email: string;
  friends?: [{}];
  favorites?: [{}];
}
