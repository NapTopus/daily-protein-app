import api from './client'

export interface Item {
  name: string
  protein: number
  date: string
}

/** 新增蛋白質項目 */
export function createItem(payload: Item) {
  return api.post('items', payload)
}

