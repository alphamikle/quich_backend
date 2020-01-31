export interface FetchResponse {
  kkmExtraInfo: KkmExtraInfo;
  ticket: Ticket;
  retailPlaceAddress: string;
  kkmSerialNumber: string;
  foundDate: Date;
  owned: boolean;
  ticketDescription: string;
  orgTitle: string;
  taxes: WelcomeTax[];
  orgId: string;
  kkmFnsId: string;
}

export interface KkmExtraInfo {
  fnsUrl: string;
  senderAddress: string;
  protocolVersion1209: number;
  owner: Owner;
  retailPlace: string;
  effectiveFrom: Date;
  offlineMode: number;
  lotteryMode: number;
  gamblingMode: number;
  agentMode: number;
  autoMode: number;
  excise: boolean;
  internetSign: number;
  protocolVersion: string;
}

export interface Owner {
  id: number;
  type: string;
  title: string;
  inn: string;
  fullTitle: string;
  externalId: ExternalID;
  keys: ExternalID[];
  version: number;
}

export interface ExternalID {
  value: string;
  kind: string;
}

export interface WelcomeTax {
  rate: number;
  name: string;
  sum: number;
}

export interface Ticket {
  requestPayload: null;
  cashTotalSum: number;
  counterSubmissionSum: number;
  userProperty: UserProperty;
  items: Item[];
  fiscalDriveNumber: string;
  fiscalDocumentNumber: number;
  fiscalId: string;
  operationType: number;
  totalSum: number;
  requestNumber: number;
  taxationType: number;
  prepaymentSum: number;
  postpaymentSum: number;
  nds20: number;
  taxes: TicketTax[];
  field1209: number;
  ecashTotalSum: number;
  kktRegId: string;
  shiftNumber: number;
  userInn: string;
  operatorPhoneToTransfer: any[];
  paymentAgentPhone: any[];
  operatorPhoneToReceive: any[];
  providerPhone: any[];
  operator: Operator;
  kkmId: string;
  retailPlace: string;
  fnsUrl: string;
  transactionDate: Date;
  user: string;
  protocolVersion: number;
  type: string;
  qrCode: string;
  externalKeys: any[];
  options: TicketOptions;
  payload: null;
  transactionId: string;
  payments: Payment[];
  eligibleForNds20: boolean;
}

export interface Item {
  itemType: number;
  options: ItemOptions;
  sum: number;
  ndsRate: number;
  commodity: Commodity;
  calculationSubjectSign: number;
  price: number;
  quantity: number;
  calculationTypeSign: number;
  name: string;
}

export interface Commodity {
  sum: number;
  taxes: CommodityTax[];
  price: number;
  quantity: number;
  code: number;
  name: string;
}

export interface CommodityTax {
  inTotalSum: boolean;
  layout: Layout;
}

export interface Layout {
  type: string;
  rate: number;
}

export interface ItemOptions {
  quantity: string;
  name: string;
  sum: string;
  price: string;
  ndsRate: string;
  calculationSubjectSign: string;
  calculationTypeSign: string;
}

export interface Operator {
  name: string;
  code: number;
}

export interface TicketOptions {
  dateTime: string;
  userInn: string;
  totalSum: string;
  operator: string;
  cashTotalSum: string;
  kktRegId: string;
  shiftNumber: string;
  fiscalDocumentNumber: string;
  fiscalDriveNumber: string;
  requestNumber: string;
  user: string;
  operationType: string;
  taxationType: string;
  fnsUrl: string;
  fiscalSign: string;
  ecashTotalSum: string;
  nds18: string;
  retailPlace: string;
  protocolVersion: string;
  prepaymentSum: string;
  postpaymentSum: string;
  counterSubmissionSum: string;
  '#47@1/2/3/4/5/6/7/8': string;
  senderAddress: string;
  retailPlaceAddress: string;
  orgId: string;
}

export interface Payment {
  sum: number;
  paymentType: string;
}

export interface TicketTax {
  sum: number;
  inTotalSum: boolean;
  layout: Layout;
}

export interface UserProperty {
  key: string;
  value: string;
}
