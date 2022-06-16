const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const Champion = require("./championModel");

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App escuchando el puerto ${port}!`));

const mongoUrl = process.env.MONGO_DB_URL || 'mongodb+srv://nayo123:yamaha112@cluster0.nyoc9.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

!db ? console.log("Error al conectar a la bd") : console.log("Conexion a la bd exitosa");

const getChampion = async (name) => {
    try {
        const postFetched = await Champion.findOne(name);
        return {
            ...postFetched._doc,            
        }
    } catch (error) {
        throw error
    }
}

const getAllChampions = async () => {
    try {
        const championsFetched = await Champion.find()
        return championsFetched.map(post => {
            return {
            ...post._doc,          
            }
        })
    } catch (error) {
        throw error
    }
}

const hello = () => {
    return 'Hello world!';
}

const schemas = graphql.buildSchema(
    `
        type Query {
            champion(name: String!): Champion
            allChampion: [Champion]
            hello: String
        }
        type Champion {
            id: ID!
            name: String!
            rarity: String
            faction: String
            type: String
            element: String
            stats: Stats!
        }
        type Stats {
            health: Int!
            attack: Int!
            defense: Int!
            criticalRate: Int!
            criticalDamage: Int!
            speed: Int!
            resistance: Int!
            accuracy: Int!
        }
    `
)

const root = {
	champion: getChampion,
	allChampion: getAllChampions,
    hello: hello
}

app.use( cors() );

app.use('/graphql', graphqlHTTP.graphqlHTTP({
	schema: schemas,
	rootValue: root,
	graphiql: true
}));