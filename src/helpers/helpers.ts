import mysql from 'mysql2/promise';

import { dbConfigRemote } from '../config.js';

type QueryRes<T> = [T, null] | [null, Error];

export const DbQuery = async <T>(
  sql: string,
  valuesArr: (string | number)[] = []
): Promise<QueryRes<T>> => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfigRemote);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [res, _fields] = await conn.execute(sql, valuesArr);
    return [res as T, null];
  } catch (err) {
    console.log(err);
    return [null, err as Error];
  } finally {
    if (conn) conn.end();
  }
};
