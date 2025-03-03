import React from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const HabitList = () => {
  // 模拟习惯数据
  const habits = [
    {
      id: 1,
      name: '每日阅读',
      type: 'positive',
      description: '每天阅读30分钟',
      points: 10,
      negativePoints: -5,
      completed: false
    },
    // 更多习惯...
  ];

  const handleEdit = (habit) => {
    // 处理编辑习惯
    console.log('编辑习惯:', habit);
  };

  const handleDelete = (habit) => {
    // 处理删除习惯
    console.log('删除习惯:', habit);
  };

  const handleToggleComplete = (habit) => {
    // 处理习惯完成状态切换
    console.log('切换完成状态:', habit);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        我的习惯
      </Typography>
      <Grid container spacing={2}>
        {habits.map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    {habit.name}
                  </Typography>
                  <Chip 
                    label={habit.type === 'positive' ? '正向' : '负向'}
                    color={habit.type === 'positive' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {habit.description}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  积分: {habit.type === 'positive' ? `+${habit.points}` : habit.points}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Box>
                    <IconButton onClick={() => handleEdit(habit)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(habit)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <IconButton 
                    onClick={() => handleToggleComplete(habit)}
                    color={habit.completed ? 'success' : 'default'}
                  >
                    {habit.completed ? <CheckCircleIcon /> : <CancelIcon />}
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HabitList;