import { pause } from 'base/pause';

export type TodoContent = {
  text: string,
  completed: boolean,
}

export type Todo = {
  id: number,
} & TodoContent;

export type ReadonlyTodo = Readonly<Todo>;

export class TodoService {

  constructor(
    private readonly delay: () => Promise<void> = () => pause(100),
    private todos: readonly ReadonlyTodo[] = [],
    private nextId: number = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1,
  ) {

  }

  async getTodos() {
    await this.delay();
    return this.todos;
  }

  async addTodo(content: Omit<TodoContent, 'completed'>): Promise<ReadonlyTodo> {
    await this.delay();
    const todo = {
      ...content,
      completed: false,
      id: this.nextId++,
    };
    this.todos = [...this.todos, todo];
    return todo;
  }

  async updateTodo(todo: ReadonlyTodo) {
    await this.delay();
    const index = this.todos.findIndex(({ id }) => id === todo.id);
    if (index === -1) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }
    const todos = [...this.todos];
    todos[index] = todo;
    this.todos = todos;
  }

  async updateTodoCompleted(id: number, completed: boolean) {
    await this.delay();
    this.todos = this.todos.map(function (todo) {
      if (todo.id === id) {
        return {
          ...todo,
          completed,
        };
      }
      return todo;
    });
  }

  async updateTodoText(id: number, text: string) {
    await this.delay();
    this.todos = this.todos.map(function (todo) {
      if (todo.id === id) {
        return {
          ...todo,
          text,
        };
      }
      return todo;
    });
  }

  async deleteTodo(id: number) {
    await this.delay();
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== id;
    });
  }
}
