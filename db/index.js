const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');


async function createUser({ 
    username, 
    password,
    name,
    location 
}) {

    try {
        const {rows: [user] } = await client.query(`
        INSERT INTO users(username, password, name, location)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(id, fields = {}) {
      //build the string set
      const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1}`
      ).join(', ');

      // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id= ${id}
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}


async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active
      FROM users;
    `);
  
    return rows;
  }

  async function createPost({
    authorId,
    title,
    content
  }) {
    try {
        const {rows: [post] } = await client.query(`
        INSERT INTO post(authorId, title, content)
        VALUES ($1, $2, $3)
        ON CONFLICT (authorId) DO NOTHING 
        RETURNING *;
        `, [authorId, title, content]);
      
        return post;
  
    } catch (error) {
      throw error;
    }
  }

  async function updatePost(id, fields = {}) { 

    const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
    return;
    }

     try {
    const {rows: [post] } = await client.query(`
      UPDATE post
      SET ${setString}
      WHERE authorId= ${id}
      RETURNING *;
    `, Object.values(fields));

    return post;
  
    } catch (error) {
      throw error;
    }
  }

  async function getAllPosts() {
    try {
        const { post } = await client.query(
            `SELECT id, authorId, title, content
            FROM posts;
          `);
        
          return post;
  
    } catch (error) {
      throw error;
    }
  }

  async function getPostsByUser(userId) {
    try {
      const { rows } = client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(userId) {
    try{
        const {rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE "id"=${ userId };
            `);

        if (rows.length == 0){
            return null;
        }else{
            delete user['password'];
            user.posts = getPostsByUser(userId);
            return user;
        }
    } catch (error) {
        throw error;
    }
  }
  
  // and export them
  module.exports = {
    client,
    createUser,
    getAllUsers,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById
  }


  