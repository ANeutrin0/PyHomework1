import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, CheckCircle as HabitIcon, Task as TaskIcon, BarChart as StatsIcon, EmojiEvents as GameIcon } from '@mui/icons-material';
import StatisticsOverview from './components/statistics/StatisticsOverview';
import HabitManager from './components/habits/HabitManager';
import TaskManager from './components/tasks/TaskManager';
import PointsShop from './components/achievements/PointsShop';

const drawerWidth = 240;

const menuItems = [
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { text: '习惯管理', icon: <HabitIcon />, path: '/habits' },
    { text: '任务管理', icon: <TaskIcon />, path: '/tasks' },
    { text: '数据统计', icon: <StatsIcon />, path: '/statistics' },
    { text: '积分商店', icon: <GameIcon />, path: '/points-shop' },
];

function App() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ mt: 2 }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        智能习惯追踪和任务管理系统
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8,
                }}
            >
                <Routes>
                    <Route path="/" element={<StatisticsOverview />} />
                    <Route path="/habits" element={<HabitManager />} />
                    <Route path="/tasks" element={<TaskManager />} />
                    <Route path="/statistics" element={<StatisticsOverview />} />
                    <Route path="/points-shop" element={<PointsShop />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;