import api from './client'

/** 取得蛋白質紀錄 */
export function getRecords(payload: {
  from: string
  to?: string
}) {
  return api.get('records', { params: payload })
}