import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShopIcon,
  Redeem as RedeemIcon
} from '@mui/icons-material';

const PointsShop = () => {
  const [userPoints, setUserPoints] = useState(500); // 用户当前积分
  const [rewards, setRewards] = useState([
    { id: 1, name: '额外休息时间', description: '获得30分钟额外休息时间', points: 100 },
    { id: 2, name: '看电影', description: '看一部想看的电影', points: 200 },
    { id: 3, name: '购物奖励', description: '获得100元购物基金', points: 500 }
  ]);

  const [open, setOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points: 100
  });

  const handleClickOpen = () => {
    setOpen(true);
    setEditingReward(null);
    setNewReward({ name: '', description: '', points: 100 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (editingReward) {
      setRewards(rewards.map(reward =>
        reward.id === editingReward.id
          ? { ...reward, ...newReward }
          : reward
      ));
    } else {
      setRewards([...rewards, { ...newReward, id: rewards.length + 1 }]);
    }
    handleClose();
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setNewReward({
      name: reward.name,
      description: reward.description,
      points: reward.points
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRewards(rewards.filter(reward => reward.id !== id));
  };

  const handleRedeem = (reward) => {
    if (userPoints >= reward.points) {
      setUserPoints(userPoints - reward.points);
      // TODO: 实现奖励兑换逻辑
      alert(`成功兑换: ${reward.name}`);
    } else {
      alert('积分不足');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          积分商店
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<ShopIcon />}
            label={`当前积分: ${userPoints}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            添加奖励
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {rewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {reward.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(reward)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(reward.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {reward.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={`${reward.points}积分`}
                    color="secondary"
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RedeemIcon />}
                    onClick={() => handleRedeem(reward)}
                    disabled={userPoints < reward.points}
                  >
                    兑换
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingReward ? '编辑奖励' : '添加新奖励'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="奖励名称"
            fullWidth
            value={newReward.name}
            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={2}
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="所需积分"
            type="number"
            fullWidth
            value={newReward.points}
            onChange={(e) => setNewReward({ ...newReward, points: parseInt(e.target.value) || 0 })}
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

export default PointsShop;