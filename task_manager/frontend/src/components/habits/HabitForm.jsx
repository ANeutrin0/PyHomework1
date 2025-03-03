import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const HabitForm = ({ open, onClose, habit }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    type: habit?.type || 'positive',
    description: habit?.description || '',
    points: habit?.points || 10,
    negativePoints: habit?.negativePoints || -5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理表单提交
    console.log('提交习惯数据:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{habit ? '编辑习惯' : '添加新习惯'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="习惯名称"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              row
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <FormControlLabel
                value="positive"
                control={<Radio />}
                label="正向习惯"
              />
              <FormControlLabel
                value="negative"
                control={<Radio />}
                label="负向习惯"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            label="描述"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label="完成积分"
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="未完成扣分"
            name="negativePoints"
            type="number"
            value={formData.negativePoints}
            onChange={handleChange}
            required
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HabitForm;