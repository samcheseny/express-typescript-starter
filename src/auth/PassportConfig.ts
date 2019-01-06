import * as passport from 'passport';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';
import {AccessToken, Client, User} from '../models';
import * as crypto from 'crypto';

passport.use("clientPassword", new ClientPasswordStrategy(
    (client_id: string, client_secret: string, done: any) => {

        new Client().findOne(client_id)
            .then(client => {

                if (!client || !client.active) {
                    return done(null, false);
                }

                if (client.secret === client_secret) {
                    return done(null, client);
                }

                return done(null, false);

            })
            .catch(error => done(error))
    }
));

passport.use("bearer", new BearerStrategy(
    (token: string, done: any) => {

        let tokenHash = crypto.createHash('sha1').update(token).digest('hex');

        new AccessToken().findByCriteria({token: tokenHash, revoked: false})
            .then(accessToken => {

                if (!accessToken || new Date() > accessToken.expirationDate) {
                    return done(null, false);
                }

                new User().findOne(accessToken.userID)
                    .then(user => {

                        if (!user) {
                            return done(null, false);
                        }

                        return done(null, user);
                    })
                    .catch(error => done(error))

            })
            .catch(error => done(error));

    })
);

