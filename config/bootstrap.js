/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {


  sails.bcrypt = require('bcrypt');
  const saltRounds = 10;
  sails.getInvalidIdMsg = function (opts) {

    if (opts.id && isNaN(parseInt(opts.id))) {
        return "Primary key specfied is invalid (incorrect type).";
    }

    if (opts.fk && isNaN(parseInt(opts.fk))) {
        return "Foreign key specfied is invalid (incorrect type).";
    }

    return null;        // falsy

}
  if (await User.count() > 0) {
    return done();
  }


  if (await Person.count() > 0) {
    return done();
  }



  const hash = await sails.bcrypt.hash('123456', saltRounds);

  await User.createEach([
    { "username": "admin", "password": hash },
    { "username": "boss", "password": hash }
    // etc.
  ]);

  await Person.createEach([
    { name: "Martin Choy", age: 23 },
    { name: "Kenny Cheng", age: 22 }
    // etc.
]);
// await Person.createEach([
//     { "username": "admin", "password": hash },
//     { "Marty": "boss", "123456": hash }
//     // etc.
//   ]);
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  const martin = await Person.findOne({name: "Martin Choy"});
  const kenny = await Person.findOne({name: "Kenny Cheng"});
  const admin = await User.findOne({username: "admin"});
  const boss = await User.findOne({username: "boss"});
  
  await User.addToCollection(admin.id, 'supervises').members(kenny.id);
  await User.addToCollection(boss.id, 'supervises').members([martin.id, kenny.id]);
  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
