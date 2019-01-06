import {AccessToken, RefreshToken, User} from "../models";
import * as bcrypt from 'bcryptjs';
import * as utils from '../utils/index';

class UsersController {

    public getOne(request: any, response: any): any {
        return new User().findOne(request.params.id)
            .then(user => response.status(200).json(user))
            .catch(error => response.status(400).send(error));
    }

    public getAll(request: any, response: any): any {
        return new User().findAll()
            .then(users => response.status(200).json(users))
            .catch(error => response.status(400).send(error));
    }

    public register(request: any, response: any): void {

        bcrypt.genSalt(10, (error: Error, salt: string): any => {

            if (error) {
                return response.status(400).send(error);
            }

            bcrypt.hash(request.body.password, salt, (error: Error, hash: string) => {

                if (error) {
                    return response.status(400).send(error);
                }

                let user: User = new User();

                let data: any = {
                    id: utils.generateUUID(),
                    clientID: request.body.clientID,
                    name: request.body.name,
                    email: request.body.email,
                    password: hash,
                };

                return user.save(data)
                    .then(user => response.status(201).json(user))
                    .catch(error => response.status(400).send(error));

            });

        });
    }

    public logout(request: any, response: any): any {

        //todo: validation
        //todo: use correct http status codes
        //todo: return model info to client alongside token on login
        let authUser: any = request.body.model;

        return new User().findByCriteria({email: authUser.email, id: authUser.id})
            .then(user => {

                if (!user) {
                    return response.status(404).json(user);
                }

                new AccessToken().update({revoked: true}, {userID: authUser.id, revoked: false})
                    .then(token => {

                        //todo: add response to send
                        if (!token) {

                            let data = {
                                message: "Token not found"
                            };

                            return response.status(404).send(data);

                        }

                        new RefreshToken().update({revoked: true}, {userID: authUser.id, revoked: false})
                            .then(refreshToken => console.log(refreshToken))
                            .catch(error => console.log(error));

                    })
                    .catch(error => response.status(400).send(error));

            })
            .catch(error => response.status(400).send(error));

    }


}

export default new UsersController();
