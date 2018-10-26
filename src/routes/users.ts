import {Router} from 'express';
import {UsersController} from '../controllers';

const router = Router();

router.get('/', UsersController.getAll);

router.post('/', UsersController.create);

export const users = router;
