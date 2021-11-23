export interface InputVerifyError {
  children?: InputVerifyError[]
  type: string
  message: string
  property: string
}


export enum TwoWayAuthType {
  Email,
  Mobile
}
