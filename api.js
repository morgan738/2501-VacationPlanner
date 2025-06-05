const express = require('express')
const app = express.Router()
const {
    fetchUsers,
    fetchPlaces,
    fetchVaycay,
    createVaycay,
    deleteVaycay
 } = require('./db')

app.get('/users', async(req,res,next) => {
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})

app.get('/places', async(req,res,next) => {
    try {
        res.send(await fetchPlaces())
    } catch (error) {
        next(error)
    }
})

app.get('/vacations', async(req,res,next) => {
    try {
        res.send(await fetchVaycay())
    } catch (error) {
        next(error)
    }
})

app.post('/vacations', async(req,res,next) => {
    try {
        res.send(await createVaycay(req.body))
    } catch (error) {
        next(error)
    }
})

app.delete('/vacations/:id/user/:user_id', async (req,res,next) => {
    try {
        console.log(req.params)
        await deleteVaycay(req.params.id, req.params.user_id)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = app