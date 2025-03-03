import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const StatisticsOverview = () => {
  // 模拟数据
  const habitData = [
    { date: '周一', completionRate: 80, points: 30 },
    { date: '周二', completionRate: 65, points: 20 },
    { date: '周三', completionRate: 90, points: 35 },
    { date: '周四', completionRate: 75, points: 25 },
    { date: '周五', completionRate: 85, points: 32 },
    { date: '周六', completionRate: 95, points: 40 },
    { date: '周日', completionRate: 70, points: 28 },
  ];

  const taskData = [
    { category: '高优先级', completed: 85, total: 100 },
    { category: '中优先级', completed: 65, total: 80 },
    { category: '低优先级', completed: 45, total: 50 },
  ];

  const userStats = {
    totalPoints: 1250,
    currentLevel: 8,
    completedHabits: 45,
    completedTasks: 120,
    averageCompletion: 82,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        数据统计
      </Typography>
      
      {/* 概览卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                总积分
              </Typography>
              <Typography variant="h4">
                {userStats.totalPoints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                当前等级
              </Typography>
              <Typography variant="h4">
                Lv.{userStats.currentLevel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                已完成习惯
              </Typography>
              <Typography variant="h4">
                {userStats.completedHabits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                已完成任务
              </Typography>
              <Typography variant="h4">
                {userStats.completedTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 习惯完成率趋势图 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          习惯完成率趋势
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <LineChart
            data={habitData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completionRate"
              name="完成率(%)"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="points"
              name="获得积分"
              stroke="#82ca9d"
            />
          </LineChart>
        </Box>
      </Paper>

      {/* 任务完成情况统计 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          任务完成情况
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <BarChart
            data={taskData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" name="已完成" fill="#8884d8" />
            <Bar dataKey="total" name="总数" fill="#82ca9d" />
          </BarChart>
        </Box>
      </Paper>
    </Box>
  );
};

export default StatisticsOverview;