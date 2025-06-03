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
        INSERT INTO vacations(id, user_id, place_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), vaycay.user_id, vaycay.place_id])
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

const deleteVaycay = async (id) => {
    const SQL = `
        DELETE FROM vacations
        WHERE id = $1
    `
    await client.query(SQL, [id])
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
            created_at TIMESTAMP DEFAULT now()
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
        createVaycay({user_id: joe.id, place_id: argentina.id})
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