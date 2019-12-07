const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql;

// var books = [
//     {name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '4'},
//     {name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
//     {name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '1'},
//     {name: 'The Long Earth3', genre: 'Sci-Fi', id: '4', authorId: '3'},
//     {name: 'The Long Earth6', genre: 'Sci-Fi', id: '5', authorId: '4'},
//     {name: 'The Long Earth8', genre: 'Sci-Fi', id: '6', authorId: '2'},
// ]

// var authors = [
//     {name: 'Mahadevi Verma', age: 57, id: '1'},
//     {name: 'Premchand', age: '98', id: '2'},
//     {name: 'Sumitranandan Pant', age: 87, id: '3'},
//     {name: 'Ramdhari Singh Dinkar', age: 77, id: '4'},
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type : GraphQLID},
        name: {type : GraphQLString},
        genre: {type : GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.id);
                // return _.find(authors, {id: parent.authorId});
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type : GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({authorId: parent.id});
                // return _.filter(books, {authorId: parent.id});
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Book.findById(args.id);
                //args.id,
                //code to get data from db
                // return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Author.findById(args.id);
                // return _.find(authors, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})