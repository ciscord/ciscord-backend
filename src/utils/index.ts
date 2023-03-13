import { verify } from 'jsonwebtoken'
import { Context } from '../context'

interface Token {
  userId: string
}

export function getUserId(context: Context): string | undefined {

  return 'clf5k8sod0000qnkn0qxxn4bg'
}

export function getTenant(context: Context): string {
  // const tenantName = context.request.get('ciscord-tenant')
  // if (tenantName) {
  //   return tenantName;
  // }
  // return null;
  return 'test'
}

export const isEmpty = (value: any): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)
