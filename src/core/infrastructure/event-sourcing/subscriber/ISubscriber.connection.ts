export interface ISubscriberConnection {
  connect(callback?: (data: Partial<any>) => void);
}
