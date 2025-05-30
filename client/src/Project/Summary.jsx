import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopStats = styled.div`
  display: flex;
  gap: 16px;
`;

const StatCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 20px 24px;
  min-height: 180px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 10px;
`;

const Placeholder = styled.div`
  color: #888;
  font-size: 15px;
`;

const Summary = () => (
  <Container>
    <TopStats>
      <StatCard>
        <Title>0 completed</Title>
        <Placeholder>in the last 7 days</Placeholder>
      </StatCard>
      <StatCard>
        <Title>0 updated</Title>
        <Placeholder>in the last 7 days</Placeholder>
      </StatCard>
      <StatCard>
        <Title>0 created</Title>
        <Placeholder>in the last 7 days</Placeholder>
      </StatCard>
      <StatCard>
        <Title>0 due soon</Title>
        <Placeholder>in the next 7 days</Placeholder>
      </StatCard>
    </TopStats>
    <Grid>
      <Card>
        <Title>Status overview</Title>
        <Placeholder>The status overview for this project will display here after you create some work items.</Placeholder>
      </Card>
      <Card>
        <Title>Priority breakdown</Title>
        <Placeholder>Priority chart will be shown here.</Placeholder>
      </Card>
      <Card>
        <Title>Types of work</Title>
        <Placeholder>Work type distribution will be shown here.</Placeholder>
      </Card>
      <Card>
        <Title>Team workload</Title>
        <Placeholder>Team workload and capacity will be shown here.</Placeholder>
      </Card>
      <Card>
        <Title>Epic progress</Title>
        <Placeholder>Epic progress will be shown here.</Placeholder>
      </Card>
    </Grid>
  </Container>
);

export default Summary; 