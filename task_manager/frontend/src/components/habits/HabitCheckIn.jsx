import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';

const HabitCheckIn = () => {
  // 模拟今日习惯数据
  const todayHabits = [
    {
      id: 1,
      name: '每日阅读',
      type: 'positive',
      points: 10,
      completed: false
    },
    // 更多习惯...
  ];

  const handleToggleComplete = (habit) => {
    // 处理习惯完成状态切换
    console.log('切换完成状态:', habit);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          今日打卡
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {format(new Date(), 'yyyy年MM月dd日')}
        </Typography>
      </Box>
      <List>
        {todayHabits.map((habit) => (
          <ListItem
            key={habit.id}
            divider
            secondaryAction={
              <Box display="flex" alignItems="center">
                <Chip
                  label={`${habit.completed ? '+' : ''}${habit.points}分`}
                  color={habit.completed ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  edge="end"
                  onClick={() => handleToggleComplete(habit)}
                  color={habit.completed ? 'success' : 'default'}
                >
                  {habit.completed ? <CheckCircleIcon /> : <CancelIcon />}
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={habit.name}
              secondary={
                <Chip
                  label={habit.type === 'positive' ? '正向' : '负向'}
                  color={habit.type === 'positive' ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default HabitCheckIn;