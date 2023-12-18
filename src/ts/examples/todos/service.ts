import { pause } from 'base/pause';

export type TodoContent = {
  text: string,
  completed: boolean,
}

export type Todo = {
  id: number,
} & TodoContent;

export class TodoService {

  constructor(
    private readonly delay: () => Promise<void> = () => pause(100),
    private readonly todos: Todo[] = [],
    private nextId: number = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1,
  ) {

  }

  async getTodos() {
    await this.delay();
    return this.todos;
  }

  async addTodo(content: TodoContent): Promise<Todo> {
    await this.delay();
    const todo = {
      ...content,
      id: this.nextId++,
    };
    this.todos.push();
    return todo;
  }

  async updateTodo(todo: Todo) {
    await this.delay();
    const index = this.todos.findIndex(({ id }) => id === todo.id);
    if (index === -1) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }
    this.todos[index] = todo;
  }

  async deleteTodo(id: number) {
    await this.delay();
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    this.todos.splice(index, 1);
  }
}
