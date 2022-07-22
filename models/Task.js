const { getDb, ObjectId } = require('../db/connect');

class Task {
  constructor({ name, completed }) {
    this.name = name;
    this.completed = completed;
  }

  save() {
    const db = getDb();
    return db.collection('tasks').insertOne(this);
  }

  static find() {
    const db = getDb();
    return db.collection('tasks').find().toArray();
  }

  static findOne({ _id }) {
    const db = getDb();
    return db.collection('tasks').findOne({ _id: ObjectId(_id) });
  }

  static findOneAndDelete({ _id }) {
    const db = getDb();
    return db.collection('tasks').deleteOne({ _id: ObjectId(_id) });
  }

  static findOneAndUpdate({ _id }, data) {
    const db = getDb();
    return db
      .collection('tasks')
      .findOneAndUpdate(
        { _id: ObjectId(_id) },
        { $set: data },
        { upsert: true, returnDocument: 'after' }
      )
      .then(({ value }) => value);
  }
}

module.exports = Task;
