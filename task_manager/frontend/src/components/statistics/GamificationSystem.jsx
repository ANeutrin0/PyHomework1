import React, { useState, useEffect } from 'react';
import { Card, Progress, List, Avatar, Button, Modal, Form, Input, InputNumber, message, Tabs } from 'antd';
import { TrophyOutlined, ShoppingOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

const GamificationSystem = () => {
  const [achievements, setAchievements] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [isRewardModalVisible, setIsRewardModalVisible] = useState(false);
  
  // 获取成就列表
  const fetchAchievements = async () => {
    try {
      const response = await axios.get('/api/achievements');
      setAchievements(response.data);
    } catch (error) {
      message.error('获取成就列表失败');
    }
  };

  // 添加新奖励
  const addReward = (values) => {
    const newReward = {
      id: Date.now(),
      ...values,
      purchased: false
    };
    setRewards([...rewards, newReward]);
    setIsRewardModalVisible(false);
  };

  // 购买奖励
  const purchaseReward = (reward) => {
    if (points >= reward.points) {
      setPoints(points - reward.points);
      const updatedRewards = rewards.map(r =>
        r.id === reward.id ? { ...r, purchased: true } : r
      );
      setRewards(updatedRewards);
      message.success('奖励兑换成功！');
    } else {
      message.error('积分不足！');
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div className="gamification-system">
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><TrophyOutlined />成就系统</span>} key="1">
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={achievements}
            renderItem={achievement => (
              <List.Item>
                <Card>
                  <List.Item.Meta
                    avatar={<Avatar src={achievement.icon_url || 'https://joeschmoe.io/api/v1/random'} />}
                    title={achievement.title}
                    description={achievement.description}
                  />
                  <Progress
                    percent={(achievement.current_progress / achievement.target_value) * 100}
                    status={achievement.current_progress >= achievement.target_value ? 'success' : 'active'}
                  />
                  <p>奖励经验值：{achievement.experience_reward}</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default GamificationSystem;