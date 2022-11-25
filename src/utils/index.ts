import { verify } from 'jsonwebtoken'
import { Context } from '../types'

interface Token {
  userId: string
}

export function getUserId(context: Context) : string {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, process.env['APP_SECRET']) as Token
    return verifiedToken && verifiedToken.userId
  }
  return null;
}

export function getTenant(context: Context) : string {
  const tenantName = context.request.get('ciscord-tenant')
  if (tenantName) {
    return tenantName;
  }
  return null;
}

export const isEmpty = (value: any): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);
