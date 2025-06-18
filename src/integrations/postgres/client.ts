import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crmlucas',
  password: '320809',
  port: 5432,
});

export default pool;
