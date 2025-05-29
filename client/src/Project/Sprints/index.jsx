import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Select, Icon } from 'shared/components';
import { Form } from 'shared/components';
import moment from 'moment';
import useApi from 'shared/hooks/api';
import api from 'shared/utils/api';

const SprintCard = ({
  sprint,
  tasks,
  users,
  onAddTask,
  onEditTask,
  onDeleteTask,
  assignedUsersMap,
  onAssignUsers,
  canStart,
  isBacklog,
  onStartSprint,
  assignDropdownOpen,
  setAssignDropdownOpen,
  dropdownRefs,
}) => {
  const [taskInput, setTaskInput] = useState('');

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      Object.keys(dropdownRefs.current).forEach(taskId => {
        if (dropdownRefs.current[taskId] && !dropdownRefs.current[taskId].contains(event.target)) {
          setAssignDropdownOpen(prev => ({ ...prev, [taskId]: false }));
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ border: '1px solid #dfe1e6', borderRadius: 6, background: '#fff', padding: 24, marginBottom: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 8 }}>
        {isBacklog ? 'Backlog' : sprint?.name}
      </div>
      <form onSubmit={e => { e.preventDefault(); if (taskInput.trim()) { onAddTask(taskInput); setTaskInput(''); } }} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder={isBacklog ? 'Add a task to backlog...' : 'Add a task to this sprint...'}
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <Button type="submit" variant="secondary">Add</Button>
      </form>
      <div style={{ marginBottom: 16 }}>
        {tasks.length > 0 ? (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {tasks.map(task => (
              <li key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, border: '1px solid #eee', borderRadius: 4, padding: '6px 10px', gap: 8 }}>
                <span style={{ flex: 1 }}>{task.title}</span>
                <Icon type="settings" size={18} style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => {
                  const newTitle = prompt('Edit task', task.title);
                  if (newTitle) onEditTask(task.id, newTitle);
                }} />
                <Icon type="trash" size={18} style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => onDeleteTask(task.id)} />
                <div style={{ position: 'relative' }} ref={el => (dropdownRefs.current[task.id] = el)}>
                  <button
                    type="button"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: 'none',
                      background: '#f4f5f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginRight: 8,
                    }}
                    onClick={() => setAssignDropdownOpen(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                  >
                    <Icon type="stopwatch" size={18} />
                  </button>
                  {assignDropdownOpen[task.id] && (
                    <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 8, minWidth: 120 }}>
                      <Select
                        isMulti
                        name="assignedUsers"
                        placeholder="Assign people..."
                        options={users}
                        value={assignedUsersMap[task.id] || []}
                        onChange={val => onAssignUsers(task.id, val)}
                        style={{ width: 120 }}
                      />
                    </div>
                  )}
                </div>
                {canStart && (
                  <Button variant="primary" size="small" onClick={() => onStartSprint(task.id)}>
                    Start Sprint
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#888' }}>No tasks added yet.</div>
        )}
      </div>
    </div>
  );
};

const Sprints = ({ project, fetchProject }) => {
  const [isStartModalOpen, setStartModalOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);

  // For modal
  const [duration, setDuration] = useState(7); // days
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DDTHH:mm'));
  const [assignedUsers, setAssignedUsers] = useState([]);

  const [{ isCreating: isCreatingSprint }, createSprint] = useApi.post('/sprint');
  const [{ isCreating: isCreatingIssue }, createIssue] = useApi.post('/issues');

  // State for backlog
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [backlogAssigned, setBacklogAssigned] = useState([]);
  // State for each sprint
  const [sprintStates, setSprintStates] = useState(
    (project.sprints || []).reduce((acc, sprint) => {
      acc[sprint.id] = { tasks: [], assigned: [] };
      return acc;
    }, {})
  );

  // Group issues by sprintId (null = backlog)
  const issuesBySprint = React.useMemo(() => {
    const grouped = { backlog: [] };
    (project.issues || []).forEach(issue => {
      if (issue.sprintId) {
        if (!grouped[issue.sprintId]) grouped[issue.sprintId] = [];
        grouped[issue.sprintId].push(issue);
      } else {
        grouped.backlog.push(issue);
      }
    });
    return grouped;
  }, [project.issues]);

  // For assign dropdown open state
  const [assignDropdownOpen, setAssignDropdownOpen] = useState({});
  const dropdownRefs = useRef({});

  // Add task to sprint or backlog
  const handleAddTask = async (title, sprintId) => {
    await api.post('/issues', {
      title,
      type: 'task',
      status: 'backlog',
      priority: 'medium',
      projectId: project.id,
      sprintId: sprintId || null,
    });
    if (fetchProject) await fetchProject();
  };

  // Edit task title
  const handleEditTask = async (id, newTitle) => {
    await api.put(`/issues/${id}`, { title: newTitle });
    if (fetchProject) await fetchProject();
  };

  // Delete task
  const handleDeleteTask = async id => {
    await api.delete(`/issues/${id}`);
    if (fetchProject) await fetchProject();
  };

  // Assign users to task
  const handleAssignUsers = async (id, val) => {
    await api.put(`/issues/${id}`, { userIds: val.map(v => v.value) });
    if (fetchProject) await fetchProject();
  };

  const handleStartSprint = async (values, form) => {
    try {
      // 1. Create the sprint
      const sprintRes = await createSprint({
        name: values.name,
        startDate: values.startDate,
        endDate: calcEndDate(values.startDate, values.duration),
        goal: values.goal,
        projectId: project.id,
      });
      const sprintId = sprintRes.sprint.id;
      // 2. Create issues for each task
      for (const task of tasks) {
        await createIssue({
          title: task.title,
          type: 'task', // default type
          status: 'backlog', // default status
          priority: 'medium', // default priority
          projectId: project.id,
          sprintId,
          userIds: values.assignedUsers,
        });
      }
      setStartModalOpen(false);
      setTasks([]);
      form.reset();
      if (fetchProject) await fetchProject();
    } catch (error) {
      // Optionally handle error
      form.setStatus(error.message || 'Failed to start sprint');
    }
  };

  // Calculate end date
  const calcEndDate = (start, dur) => {
    return moment(start).add(dur, 'days').format('YYYY-MM-DDTHH:mm');
  };

  const userOptions = project.users.map(user => ({ value: user.id, label: user.name }));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Sprints</h1>
      </div>
      {/* Backlog Card */}
      <SprintCard
        isBacklog
        sprint={null}
        tasks={issuesBySprint.backlog}
        users={userOptions}
        onAddTask={title => handleAddTask(title, null)}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        assignedUsersMap={Object.fromEntries(
          (issuesBySprint.backlog || []).map(issue => [issue.id, (issue.userIds || []).map(uid => userOptions.find(u => u.value === uid))])
        )}
        onAssignUsers={handleAssignUsers}
        canStart={true}
        onStartSprint={() => {}}
        assignDropdownOpen={assignDropdownOpen}
        setAssignDropdownOpen={setAssignDropdownOpen}
        dropdownRefs={dropdownRefs}
      />
      {/* Sprint Cards */}
      {project.sprints && project.sprints.length > 0 && project.sprints.map(sprint => (
        <SprintCard
          key={sprint.id}
          sprint={sprint}
          tasks={issuesBySprint[sprint.id] || []}
          users={userOptions}
          onAddTask={title => handleAddTask(title, sprint.id)}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          assignedUsersMap={Object.fromEntries(
            (issuesBySprint[sprint.id] || []).map(issue => [issue.id, (issue.userIds || []).map(uid => userOptions.find(u => u.value === uid))])
          )}
          onAssignUsers={handleAssignUsers}
          canStart={sprint.status !== 'completed'}
          onStartSprint={() => {}}
          assignDropdownOpen={assignDropdownOpen}
          setAssignDropdownOpen={setAssignDropdownOpen}
          dropdownRefs={dropdownRefs}
        />
      ))}
      <Modal
        isOpen={isStartModalOpen}
        title="Start Sprint"
        onClose={() => setStartModalOpen(false)}
        renderContent={modal => (
          <Form
            initialValues={{
              name: '',
              duration: 7,
              startDate: moment().format('YYYY-MM-DDTHH:mm'),
              goal: '',
              assignedUsers: [],
            }}
            validations={{
              name: [Form.is.required(), Form.is.maxLength(100)],
              duration: Form.is.required(),
              startDate: Form.is.required(),
              goal: Form.is.maxLength(200),
            }}
            onSubmit={handleStartSprint}
          >
            <Form.Field.Input name="name" label="Sprint Name" />
            <Form.Field.Input
              name="duration"
              label="Duration (days)"
              type="number"
              min={1}
              onChange={e => setDuration(Number(e.target.value))}
            />
            <Form.Field.Input
              name="startDate"
              label="Start Date & Time"
              type="datetime-local"
              onChange={e => setStartDate(e.target.value)}
            />
            <Form.Field.Input
              name="endDate"
              label="End Date"
              type="datetime-local"
              value={calcEndDate(startDate, duration)}
              disabled
            />
            <Form.Field.Input name="goal" label="Sprint Goal" />
            <Form.Field.Select
              isMulti
              name="assignedUsers"
              label="Assign People"
              options={userOptions}
              onChange={setAssignedUsers}
            />
            <Form.Field.Submit>Start Sprint</Form.Field.Submit>
          </Form>
        )}
      />
    </div>
  );
};

Sprints.propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func,
};

export default Sprints; 