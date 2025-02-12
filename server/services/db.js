class Database {
  constructor(env) {
    this.db = env.DB;
  }

  async query(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).all();
      }
      return await stmt.all();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async execute(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).run();
      }
      return await stmt.run();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

export default Database; 