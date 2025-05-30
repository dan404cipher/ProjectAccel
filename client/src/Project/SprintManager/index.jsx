import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import useApi from 'shared/hooks/api';
import { Button, Modal } from 'shared/components';
import { Form } from 'shared/components';

import { SprintManagerContainer, SprintList, SprintItem, SprintHeader } from './Styles';

const SprintManager = ({ project }) => {
  const [{ isCreating }, createSprint] = useApi.post('/sprint');
  const [{ isUpdating }, updateSprint] = useApi.put('/sprint');

  const handleCreateSprint = async (values, form) => {
    try {
      await createSprint({
        ...values,
        projectId: project.id,
        startDate: moment(values.startDate).toISOString(),
        endDate: moment(values.endDate).toISOString(),
      });
      form.reset();
    } catch (error) {
      Form.handleAPIError(error, form);
    }
  };

  const handleUpdateSprint = async (sprintId, status) => {
    try {
      await updateSprint({
        sprintId,
        status,
      });
    } catch (error) {
      console.error('Failed to update sprint:', error);
    }
  };

  return (
    <SprintManagerContainer>
      <SprintHeader>
        <h2>Sprints</h2>
        <Modal
          title="Create Sprint"
          renderLink={modal => (
            <Button variant="primary" onClick={modal.open}>
              Create Sprint
            </Button>
          )}
          renderContent={modal => (
            <Form
              initialValues={{
                name: '',
                startDate: '',
                endDate: '',
              }}
              validations={{
                name: [Form.is.required(), Form.is.maxLength(100)],
                startDate: Form.is.required(),
                endDate: Form.is.required(),
              }}
              onSubmit={handleCreateSprint}
            >
              <Form.Field.Input name="name" label="Sprint Name" />
              <Form.Field.Input name="startDate" label="Start Date" type="date" />
              <Form.Field.Input name="endDate" label="End Date" type="date" />
              <Form.Field.Submit isWorking={isCreating}>Create Sprint</Form.Field.Submit>
            </Form>
          )}
        />
      </SprintHeader>

      <SprintList>
        {project.sprints?.map(sprint => (
          <SprintItem key={sprint.id}>
            <div>
              <h3>{sprint.name}</h3>
              <p>
                {moment(sprint.startDate).format('MMM D')} - {moment(sprint.endDate).format('MMM D, YYYY')}
              </p>
            </div>
            <div>
              <Button
                variant="empty"
                onClick={() => handleUpdateSprint(sprint.id, 'completed')}
                disabled={sprint.status === 'completed'}
              >
                Complete
              </Button>
            </div>
          </SprintItem>
        ))}
      </SprintList>
    </SprintManagerContainer>
  );
};

SprintManager.propTypes = {
  project: PropTypes.object.isRequired,
};

export default SprintManager; 