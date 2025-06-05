const pg = require('pg')
const client = new pg.Client('postgres://localhost/vacation_agency')
const {v4} = require('uuid')
const uuidv4 = v4

const createUser = async (user) => {
    const SQL = `
        INSERT INTO users(id, name)
        VALUES ($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), user.name])
    return response.rows[0]
}

const createPlaces = async (place) => {
    const SQL = `
        INSERT INTO places(id, name)
        VALUES ($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), place.name])
    return response.rows[0]
}

const createVaycay = async (vaycay) => {
    const SQL = `
        INSERT INTO vacations(id, user_id, place_id, start_date, end_date, party_count)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), vaycay.user_id, vaycay.place_id, vaycay.start_date, vaycay.end_date, vaycay.party_count])
    return response.rows[0]
}

const fetchUsers = async () => {
    const SQL = `
        SELECT *
        FROM users
    `
    const response = await client.query(SQL)
    return response.rows
}
const fetchPlaces = async () => {
    const SQL = `
        SELECT *
        FROM places
    `
    const response = await client.query(SQL)
    return response.rows
}
const fetchVaycay = async () => {
    const SQL = `
        SELECT *
        FROM vacations
    `
    const response = await client.query(SQL)
    return response.rows
}

const deleteVaycay = async (id, user_id) => {
    const SQL = `
        DELETE FROM vacations
        WHERE id = $1 AND user_id = $2
    `
    await client.query(SQL, [id, user_id])
}

const seed = async () => {
    const SQL = `
        DROP TABLE IF EXISTS vacations;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS places;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE
        );
        CREATE TABLE places(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        CREATE TABLE vacations(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            place_id UUID REFERENCES places(id) NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            start_date TIMESTAMP DEFAULT now() NOT NULL,
            end_date TIMESTAMP NOT NULL,
            party_count INTEGER DEFAULT 1
        );
    `
    await client.query(SQL)
    const [moe, flo, joe, ethyl, henry,lucy] = await Promise.all([
        createUser({name:'moe'}),
        createUser({name:'flo'}),
        createUser({name:'joe'}),
        createUser({name:'ethyl'}),
        createUser({name:'henry'}),
        createUser({name:'lucy'}),
    ])

    const [japan, newZealand, scotland, italy, ghana, krypton, argentina] = await Promise.all([
        createPlaces({name:'Japan'}),
        createPlaces({name:'New Zealand'}),
        createPlaces({name:'Scotland'}),
        createPlaces({name:'Italy'}),
        createPlaces({name:'Ghana'}),
        createPlaces({name:'Krypton'}),
        createPlaces({name:'Argentina'}),
    ])

    await Promise.all([
        createVaycay({user_id: joe.id, place_id: argentina.id, start_date: new Date(2025, 9, 15), end_date: new Date(2025, 9, 22), party_count: 3})
    ])
    
    console.log('created tables and seeded data')

}

module.exports = {
    seed,
    client,
    fetchUsers,
    fetchPlaces,
    fetchVaycay,
    createVaycay,
    deleteVaycay
}