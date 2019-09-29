export interface DadataResponse {
  suggestions: Suggestion[];
}

export interface Suggestion {
  value: string;
  unrestricted_value: string;
  data: Data;
}

export interface Data {
  kpp: string;
  capital: null;
  management: null;
  founders: null;
  managers: null;
  branch_type: string;
  branch_count: number;
  source: null;
  qc: null;
  hid: string;
  type: string;
  state: State;
  opf: Opf;
  name: Name;
  inn: string;
  ogrn: string;
  okpo: null;
  okved: string;
  okveds: null;
  authorities: null;
  documents: null;
  licenses: null;
  finance: null;
  address: Address;
  phones: null;
  emails: null;
  ogrn_date: number;
  okved_type: string;
  employee_count: null;
}

export interface Address {
  value: string;
  unrestricted_value: string;
  data: { [ key: string ]: null | string };
}

export interface Name {
  full_with_opf: string;
  short_with_opf: string;
  latin: null;
  full: string;
  short: string;
}

export interface Opf {
  type: string;
  code: string;
  full: string;
  short: string;
}

export interface State {
  status: string;
  actuality_date: number;
  registration_date: number;
  liquidation_date: null;
}
