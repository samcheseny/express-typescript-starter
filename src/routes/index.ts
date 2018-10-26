import {Router} from 'express';
import {users} from './users';

const router = Router();

router.use('/users', users);

export const routes = router;