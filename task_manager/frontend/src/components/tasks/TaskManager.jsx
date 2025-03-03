import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: '完成项目报告', priority: '高', status: '进行中', dueDate: '2024-02-20', description: '准备季度项目总结报告', points: 100 },
    { id: 2, title: '团队会议', priority: '中', status: '待开始', dueDate: '2024-02-21', description: '讨论下周工作计划', points: 50 },
  ]);

  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: '中',
    status: '待开始',
    dueDate: '',
    description: '',
    points: 50
  });

  const handleClickOpen = () => {
    setOpen(true);
    setEditingTask(null);
    setNewTask({
      title: '',
      priority: '中',
      status: '待开始',
      dueDate: '',
      description: ''
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...newTask }
          : task
      ));
    } else {
      setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    }
    handleClose();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      description: task.description
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === '完成' ? '进行中' : '完成' }
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '高': return 'error';
      case '中': return 'warning';
      case '低': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '完成': return 'success';
      case '进行中': return 'info';
      case '待开始': return 'default';
      default: return 'default';
    }
  };

  const renderTaskSection = (title, tasks) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} divider>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {task.title}
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority)}
                    />
                    <Chip
                      label={task.status}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                    <Chip
                      label={`${task.points}积分`}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      截止日期: {task.dueDate}
                    </Typography>
                    {` - ${task.description}`}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleStatusChange(task.id)} sx={{ mr: 1 }}>
                  <CheckIcon color={task.status === '完成' ? 'success' : 'action'} />
                </IconButton>
                <IconButton edge="end" onClick={() => handleEdit(task)} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  const pendingTasks = tasks.filter(task => task.status !== '完成');
  const completedTasks = tasks.filter(task => task.status === '完成');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          任务管理
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
              size="small"
            >
              全部任务
            </Button>
            <Button
              variant={filter === 'active' ? 'contained' : 'outlined'}
              onClick={() => setFilter('active')}
              size="small"
            >
              进行中
            </Button>
            <Button
              variant={filter === 'completed' ? 'contained' : 'outlined'}
              onClick={() => setFilter('completed')}
              size="small"
            >
              已完成
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            添加任务
          </Button>
        </Box>
      </Box>

      {renderTaskSection('待完成任务', pendingTasks)}
      {renderTaskSection('已完成任务', completedTasks)}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingTask ? '编辑任务' : '添加新任务'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="任务标题"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>优先级</InputLabel>
            <Select
              value={newTask.priority}
              label="优先级"
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <MenuItem value="高">高</MenuItem>
              <MenuItem value="中">中</MenuItem>
              <MenuItem value="低">低</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>状态</InputLabel>
            <Select
              value={newTask.status}
              label="状态"
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <MenuItem value="待开始">待开始</MenuItem>
              <MenuItem value="进行中">进行中</MenuItem>
              <MenuItem value="完成">完成</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="截止日期"
            type="date"
            fullWidth
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={2}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="完成积分"
            type="number"
            fullWidth
            value={newTask.points}
            onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;