export enum OrderState {
  DRAFT = 0,
  CREATE = 1,
  CONFIRMED = 2,
  SHIPPING = 3,
  DONE = 4,
  DROP = 101,
  USER_DROP = 102,
}

export enum OrderPayState {
  NONE = 0,
  PAID = 1,
  REFUND = 2,
}

export enum OrderPayType {
  CASH = 0,
  ONLINE = 1,
}

export enum StatisticsBy {
  MONTH = 1,
  YEAR = 2,
}
