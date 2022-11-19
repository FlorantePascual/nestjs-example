import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.filter((task) => {
      return task.id === id;
    })[0];

    if (!found) {
      throw new NotFoundException(`Task ID ${id} not found!`);
    }

    return found;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => {
      return task.id !== found.id;
    });
  }

  updateTaskById(id: string, status: TaskStatus): Task {
    // const task = this.tasks.find((task) => task.id === id);
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  getTasksWithFilter(searchTasksDto: SearchTasksFilterDto): Task[] {
    let tasks = this.getAllTasks().slice();
    const { status, searchTerm } = searchTasksDto;
    tasks = status ? tasks.filter((task) => task.status === status) : tasks;
    return searchTerm
      ? tasks.filter((task) => {
          return (
            task.title.includes(searchTerm) ||
            task.description.includes(searchTerm)
          );
        })
      : tasks;
  }
}
