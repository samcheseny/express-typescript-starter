import {Router} from 'express';
import {UsersController} from '../controllers';
import * as passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('bearer', {session: false}), UsersController.getAll);

export const users = router;
