import {Router} from 'express';
import {users} from './users';
import {auth} from './auth';

const router = Router();

router.use('/', auth);

router.use('/users', users);

export const routes = router;