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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';

const HabitManager = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: '每日阅读', frequency: '每天', streak: 5, description: '每天阅读30分钟', completed: false, points: 30 },
    { id: 2, name: '运动', frequency: '每周3次', streak: 2, description: '每次运动30分钟', completed: false, points: 50 },
  ]);

  const [open, setOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: '每天',
    description: '',
    points: 30
  });

  const handleClickOpen = () => {
    setOpen(true);
    setEditingHabit(null);
    setNewHabit({ name: '', frequency: '每天', description: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (editingHabit) {
      setHabits(habits.map(habit =>
        habit.id === editingHabit.id
          ? { ...habit, ...newHabit }
          : habit
      ));
    } else {
      setHabits([...habits, { ...newHabit, id: habits.length + 1, streak: 0, completed: false }]);
    }
    handleClose();
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      frequency: habit.frequency,
      description: habit.description
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const handleCheck = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, streak: habit.streak + 1, completed: !habit.completed }
        : habit
    ));
  };

  const renderHabitSection = (title, habits) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Paper>
        <List>
          {habits.map((habit) => (
            <ListItem key={habit.id} divider>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {habit.name}
                    <Chip
                      label={habit.frequency}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`连续${habit.streak}天`}
                      size="small"
                      color="info"
                    />
                    <Chip
                      label={`${habit.points}积分/次`}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                }
                secondary={habit.description}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handleCheck(habit.id)} 
                  sx={{ mr: 1 }}
                  color={habit.completed ? 'success' : 'default'}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleEdit(habit)} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(habit.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  const pendingHabits = habits.filter(habit => !habit.completed);
  const completedHabits = habits.filter(habit => habit.completed);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          习惯管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          添加习惯
        </Button>
      </Box>

      {renderHabitSection('待完成习惯', pendingHabits)}
      {renderHabitSection('已完成习惯', completedHabits)}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingHabit ? '编辑习惯' : '添加新习惯'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="习惯名称"
            fullWidth
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>频率</InputLabel>
            <Select
              value={newHabit.frequency}
              label="频率"
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
            >
              <MenuItem value="每天">每天</MenuItem>
              <MenuItem value="每周3次">每周3次</MenuItem>
              <MenuItem value="每周5次">每周5次</MenuItem>
              <MenuItem value="每月">每月</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={2}
            value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="完成积分"
            type="number"
            fullWidth
            value={newHabit.points}
            onChange={(e) => setNewHabit({ ...newHabit, points: parseInt(e.target.value) || 0 })}
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

export default HabitManager;