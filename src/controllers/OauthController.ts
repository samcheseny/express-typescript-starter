import * as oauth2orize from 'oauth2orize';
import {AccessToken, RefreshToken, User} from '../models';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as utils from '../utils/index';
import * as passport from 'passport';

const server = oauth2orize.createServer();

// Resource Owner Password
server.exchange(oauth2orize.exchange.password((client: any, username: string, password: string, scope: any, done: any) => {

    new User().findByCriteria({email: username})
        .then(user => {

            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password)
                .then(response => {

                    if (!response) {
                        return done(null, false);
                    }

                    let token: string = utils.getUniqueID(256);
                    let refreshToken: string = utils.getUniqueID(256);
                    let tokenHash: string = crypto.createHash('sha1').update(token).digest('hex');
                    let refreshTokenHash: string = crypto.createHash('sha1').update(refreshToken).digest('hex');
                    let expirationDate: Date = new Date(new Date().getTime() + (3600 * 1000));

                    let data: any = {
                        id: utils.generateUUID(),
                        token: tokenHash,
                        expirationDate: expirationDate,
                        clientID: client.id,
                        userID: user.id,
                        scope: scope
                    };

                    let newAccessToken: AccessToken = new AccessToken();

                    newAccessToken.save(data)
                        .then(createdAccessToken => {

                            let newRefreshToken: RefreshToken = new RefreshToken();

                            data = {
                                id: utils.generateUUID(),
                                refreshToken: refreshTokenHash,
                                clientID: client.id,
                                userID: user.id
                            };

                            newRefreshToken.save(data)
                                .then(createdRefreshToken =>
                                    done(null, token, refreshToken, {expires_in: expirationDate})
                                )
                                .catch(error => done(error));

                        })
                        .catch(error => done(error));
                })
                .catch(error => done(error));
        })
        .catch(error => done(error));

}));

// Refresh Token
server.exchange(oauth2orize.exchange.refreshToken((client: any, refreshToken: string, scope: any, done: any) => {

    let refreshTokenHash: string = crypto.createHash('sha1').update(refreshToken).digest('hex');

    new RefreshToken().findByCriteria({refreshToken: refreshTokenHash, revoked: false})
        .then(token => {

            if (!token) {
                return done(null, false);
            }

            let newAccessToken: string = utils.getUniqueID(256);
            let accessTokenHash: string = crypto.createHash('sha1').update(newAccessToken).digest('hex');
            let expirationDate: Date = new Date(new Date().getTime() + (3600 * 1000));

            new AccessToken().update(
                {token: accessTokenHash, scope: scope, expirationDate: expirationDate},
                {userID: token.userID}
            )
                .then(token => done(null, newAccessToken, refreshToken, {expires_in: expirationDate}))
                .catch(error => done(error));

        })
        .catch(error => done(error));
}));

// Token endpoint
export let token:Array<any> = [
    passport.authenticate('clientPassword', {session: false}),
    server.token(),
    server.errorHandler()
];