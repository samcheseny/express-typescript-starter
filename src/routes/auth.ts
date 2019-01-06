import {Router} from 'express';
import {OauthController, UsersController} from '../controllers';
import * as passport from 'passport';

const router = Router();

router.post('/oauth/token', OauthController.token);

router.post('/register', UsersController.register);

router.post('/logout', passport.authenticate('bearer', {session: false}), UsersController.logout);

export const auth = router;