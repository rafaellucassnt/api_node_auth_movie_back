exports.seed = async function(knex) {
  // Deletes ALL existing entries
      await knex('usuarios').del()
      await knex('usuarios').insert([
        { "id":"1","name": "Admin","username": "admin","email": "admin@example.com","password": "password123","roles": "ADMIN;USER" },
        {"id":"2","name": "User1","username": "user1","email": "user1@example.com", "password": "password123","roles": "USER"}, 
      ]);
      };