import { Router } from 'express';
import authRoutes from './auth.routes';
// Import other route modules here when created
// import changeRequestRoutes from './change-request.routes';
// import userRoutes from './user.routes';
// import sprintRoutes from './sprint.routes';

const router = Router();

// Register routes
router.use('/auth', authRoutes);
// router.use('/change-requests', changeRequestRoutes);
// router.use('/users', userRoutes);
// router.use('/sprints', sprintRoutes);

export default router;
