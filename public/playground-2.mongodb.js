/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('aula_16');

// Search for documents in the current collection.
// db.getCollection('user')
//   .find(
//     $eq{"name":}
//   );
/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// // The current database to use.
// use('aula_16');


// db.getCollection('user').find({});
// questao1 
// db.getCollection("user").find({name:{ $regex: /^Clifford Johnathan/i}},{name:1,_id:0,occupation:1});
// questao2
// db.getCollection("user").find({$and: [{age:{$gt:18}},{age:{$lt:30}}]}).count{[]};
//questao8
//db.getCollection("aaa").find({$or: [{genres: {$regex:/^Comedy/i}},{genres:{$regex:/^Action/i}}]}).count();
