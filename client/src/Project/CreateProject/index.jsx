import React from 'react';
import { useHistory } from 'react-router-dom';
import useApi from 'shared/hooks/api';
import { Form, PageLoader, Button } from 'shared/components';
import { ProjectCategory, ProjectCategoryCopy } from 'shared/constants/projects';

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

const CreateProject = () => {
  const history = useHistory();
  const [{ isCreating }, createProject] = useApi.post('/project');

  const handleSubmit = async (values, form) => {
    try {
      const { project } = await createProject(values);
      history.push(`/project/${project.id}/board`);
      window.location.reload();
    } catch (error) {
      Form.handleAPIError(error, form);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 32 }}>
      <h1 style={{ marginBottom: 24 }}>Create New Project</h1>
      <Form
        initialValues={{ name: '', url: '', category: '', description: '' }}
        validations={{
          name: [Form.is.required(), Form.is.maxLength(100)],
          url: Form.is.url(),
          category: Form.is.required(),
        }}
        onSubmit={handleSubmit}
      >
        <Form.Element>
          <Form.Field.Input name="name" label="Name" />
          <Form.Field.Input name="url" label="URL" />
          <Form.Field.Textarea name="description" label="Description" tip="Describe the project in as much detail as you'd like." />
          <Form.Field.Select name="category" label="Project Category" options={categoryOptions} />
          <Button type="submit" variant="primary" isWorking={isCreating} style={{ marginTop: 20 }}>
            Create Project
          </Button>
        </Form.Element>
      </Form>
    </div>
  );
};

export default CreateProject; 