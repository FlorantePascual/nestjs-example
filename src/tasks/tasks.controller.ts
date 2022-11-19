import { Task } from './tasks.model';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksFilterDto } from './dto/search-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() searchTasksFilterDto: SearchTasksFilterDto): Task[] {
    if (searchTasksFilterDto.status || searchTasksFilterDto.searchTerm) {
      return this.taskService.getTasksWithFilter(searchTasksFilterDto);
    }
    return this.taskService.getAllTasks();
  }

  @Get('/:id')
  getTasksById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): void {
    return this.taskService.deleteTaskById(id);
  }

  @Post()
  // createTask(@Body() body): Task {
  //   const title = body.title;
  //   const description = body.description;
  //   return this.taskService.createTask(title, description);
  // }
  // createTask(@Body('title') title, @Body('description') description): Task {
  //   return this.taskService.createTask(title, description);
  // }
  // after DTO
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTasksById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskById(id, status);
  }
}
