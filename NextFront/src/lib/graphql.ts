export interface Transfer {
  id: string;
  from: string;
  to: string;
  dateTime: Date;
  isCompleted: boolean;
  status: boolean;
  options: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}