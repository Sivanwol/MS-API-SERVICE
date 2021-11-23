export const MailerData ={
  confirm_new_user: {
    title: (param: any) => (`HI ${param.firstName} Please Confirm You're email`),
    template: 'd-0349f8d3a140416c963065aa7855fe80',
    params: ['firstName']
  }
}
export interface IMailerData {
  titleParams: IKeyValueObject[]
  dataParams: IKeyValueObject[]
}
export interface IKeyValueObject{
  key: string,
  value: string
}

