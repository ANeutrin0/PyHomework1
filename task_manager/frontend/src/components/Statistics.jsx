import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from '@ant-design/plots';
import { Card, Row, Col, Statistic } from 'antd';

const Statistics = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [trendsData, setTrendsData] = useState({
    habits_trend: [],
    tasks_trend: []
  });

  useEffect(() => {
    // 获取统计摘要数据
    const fetchSummary = async () => {
      try {
        const response = await axios.get('/api/statistics/summary');
        setSummaryData(response.data);
      } catch (error) {
        console.error('获取统计摘要失败:', error);
      }
    };

    // 获取趋势数据
    const fetchTrends = async () => {
      try {
        const response = await axios.get('/api/statistics/trends?period=week');
        setTrendsData(response.data);
      } catch (error) {
        console.error('获取趋势数据失败:', error);
      }
    };

    fetchSummary();
    fetchTrends();
  }, []);

  const habitConfig = {
    data: trendsData.habits_trend,
    xField: 'date',
    yField: 'count',
    smooth: true,
    meta: {
      count: {
        alias: '完成次数'
      },
      date: {
        alias: '日期'
      }
    }
  };

  const taskConfig = {
    data: trendsData.tasks_trend,
    xField: 'date',
    yField: 'count',
    smooth: true,
    meta: {
      count: {
        alias: '完成次数'
      },
      date: {
        alias: '日期'
      }
    }
  };

  return (
    <div className="statistics-container">
      {summaryData && (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="习惯完成率"
                value={summaryData.habit_stats.completion_rate}
                suffix="%"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="任务完成率"
                value={summaryData.task_stats.completion_rate}
                suffix="%"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="最长习惯连续天数"
                value={summaryData.habit_stats.longest_streak}
                suffix="天"
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="习惯完成趋势">
            <Line {...habitConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="任务完成趋势">
            <Line {...taskConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;