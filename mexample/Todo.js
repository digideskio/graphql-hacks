var uuid = require('node-uuid');

var mongo = require('./mongo');

class Todo {
  constructor({id, text, completed, username}) {
    this.id = id || uuid.v4();
    this.text = text || '';
    this.completed = completed || false;
    if (!username) {
      throw new Error('todo items must have a username');
    }
    this.username = username;
  }

  // Returns a promise for a list of todos with the given username
  static findByUsername(username) {
    return mongo.db.todo.find({username}).toArray().then((items) => {
      return items.map(item => new Todo(item));
    });
  }

  static addTodo({text}, request) {
    if (!request.user || !request.user.username) {
      throw new Error('must be logged in to call addTodo');
    }
    var content = {
      id: uuid.v4(),
      username: request.user.username,
      text,
      completed: false,
    };
    return mongo.db.todo.insert(content).then(() => {
      return new Todo(content);
    })
  }

  static deleteTodo({id}, request) {
    if (!request.user || !request.user.username) {
      throw new Error('must be logged in to call deleteTodo');
    }
    return mongo.db.todo.deleteOne({
      id: id,
      username: request.user.username,
    }).then(() => {
      return true;
    });
  }
}

module.exports = Todo;
