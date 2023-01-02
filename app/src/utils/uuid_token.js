import { v4 as uuidv4 } from 'uuid';
// 生成一个随机的 id，且每次执行不能变化，持久存储
export const getUUID = () => {
  // 先从本地存储获取 uuid
  let uuid_token = localStorage.getItem('UUIDTOKEN');
  // 如果本地存储没有 uuid，生成
  if (!uuid_token) {
    // 生成游客临时id
    uuid_token = uuidv4();
    // 本地存储
    localStorage.setItem('UUIDTOKEN', uuid_token);
  }
  return uuid_token;
};
