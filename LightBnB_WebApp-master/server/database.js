const {Pool} = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
  getUserWithEmail: (email) => {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `,[`${email}`])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.log(err.stack));
  },
  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithId: (id) => {
    return pool.query(`
    SELECT * FROM users
    WHERE id = $1
    `,[`${id}`])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.log(err.stack));
  },
    /**
   * Add a new user to the database.
   * @param {{name: string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  addUser: (user) => {
    return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES($1, $2, $3)
    RETURNING *;
    `,[`${user.name}`, `${user.email}`, `${user.password}`])
    .then(res => {
      res.rows;
    })
    .catch(err => console.log(err.stack));
  },

  /// Reservations

  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  getAllReservations: (guest_id, limit = 10) => {
    return pool.query(`
    SELECT properties.*, reservations.*, AVG(rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    AND end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY start_date ASC
    LIMIT $2;
    `,[`${guest_id}`,limit])
    .then(res => {
      return res.rows;
    })
    .catch(err => console.log(err.stack));
  },


  /// Properties

  /**
   * Get all properties.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the properties.
   */
  getAllProperties: (options, limit = 10) => {
    const queryParams = [];
    let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
    //search with city filter
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length}`;
    }
    //search with minimum price/night - optional
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`)
      queryString +=` AND cost_per_night >= $${queryParams.length}*100`
    }
    //search with maximum price/night - optional
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night}`)
      queryString +=` AND cost_per_night <= $${queryParams.length}*100`
    }
    //search with minimum rating - optional
    if (options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `
      GROUP BY properties.id
      HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
    } else {
      queryString += `
      GROUP BY properties.id`;
    }

    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
    return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log(err.stack));
  },
  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  addProperty: (property) => {
    return pool.query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, 
    street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `,[`${property.owner_id}`, `${property.title}`, `${property.description}`, `${property.thumbnail_photo_url}`, `${property.cover_photo_url}`, `${property.cost_per_night}`, `${property.street}`, 
    `${property.city}`, `${property.province}`, `${property.post_code}`, `${property.country}`, `${property.parking_spaces}`, `${property.number_of_bathrooms}`, `${property.number_of_bedrooms}`])
    .then(res => {
      res.rows;
    })
    .catch(err => console.log(err.stack));
  }
}










