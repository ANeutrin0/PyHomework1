import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Button, Tag, Space, message } from 'antd';
import { fetchTasks, updateTask, deleteTask, archiveTask } from '../../store/taskSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, error, filters, sortBy, sortOrder } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  // 处理任务状态更新
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(updateTask({ taskId, taskData: { status: newStatus } })).unwrap();
      message.success('任务状态已更新');
    } catch (err) {
      message.error('更新任务状态失败');
    }
  };

  // 处理任务归档
  const handleArchive = async (taskId) => {
    try {
      await dispatch(archiveTask(taskId)).unwrap();
      message.success('任务已归档');
    } catch (err) {
      message.error('归档任务失败');
    }
  };

  // 处理任务删除
  const handleDelete = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      message.success('任务已删除');
    } catch (err) {
      message.error('删除任务失败');
    }
  };

  // 过滤和排序任务
  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filters.status === 'all') return true;
      return task.status === filters.status;
    })
    .filter(task => {
      if (filters.priority === 'all') return true;
      return task.priority === filters.priority;
    })
    .filter(task => {
      if (filters.tags.length === 0) return true;
      return task.tags.some(tag => filters.tags.includes(tag));
    })
    .sort((a, b) => {
      const compareValue = (a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a[sortBy] > b[sortBy] ? 1 : -1;
      };
      return sortOrder === 'asc' ? compareValue(a, b) : compareValue(b, a);
    });

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  if (status === 'failed') {
    return <div>错误: {error}</div>;
  }

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={filteredAndSortedTasks}
      renderItem={task => (
        <List.Item>
          <Card
            title={task.title}
            extra={
              <Space>
                <Button onClick={() => handleStatusChange(task.id, task.status === 'TODO' ? 'COMPLETED' : 'TODO')}>
                  {task.status === 'TODO' ? '完成' : '重新打开'}
                </Button>
                <Button onClick={() => handleArchive(task.id)}>归档</Button>
                <Button danger onClick={() => handleDelete(task.id)}>删除</Button>
              </Space>
            }
          >
            <p>{task.description}</p>
            <Space>
              <Tag color="blue">{task.priority}</Tag>
              {task.tags?.split(',').map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
            <p>截止日期: {new Date(task.dueDate).toLocaleDateString()}</p>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default TaskList;