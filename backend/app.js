import express from 'express';
import cors from 'cors';

// Import routes (must include .js extension for ES modules)
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import teamRoutes from './src/routes/team.routes.js';
import inviteRoutes from './src/routes/invite.routes.js';
import joinRequestRoutes from './src/routes/joinRequest.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import superAdminRoutes from './src/routes/superAdmin.routes.js';
import activityLogRoutes from "./src/routes/activityLog.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use("/api/activity-logs", activityLogRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;