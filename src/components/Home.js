import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Grid,
  Alert
} from '@mui/material';

function Home({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    important: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', newTask, {
        headers: { Authorization: token }
      });
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '', important: false });
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        { headers: { Authorization: token } }
      );
      setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4">Task Management</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={onLogout}>
            Logout
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleCreateTask}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newTask.important}
                    onChange={(e) =>
                      setNewTask({ ...newTask, important: e.target.checked })
                    }
                  />
                }
                label="Important"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Your Tasks
      </Typography>
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} key={task._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                {task.title}{' '}
                {task.important && (
                  <Typography component="span" color="secondary" variant="subtitle1">
                    [Important]
                  </Typography>
                )}
              </Typography>
              <Typography variant="body1">{task.description}</Typography>
              <Typography
                variant="subtitle1"
                color={task.completed ? 'green' : 'red'}
              >
                {task.completed ? 'Completed' : 'Incomplete'}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => toggleComplete(task)}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
