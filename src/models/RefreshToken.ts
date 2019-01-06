import Model from './model';

export default class RefreshToken extends Model {

    constructor() {

        super();

        this.table = "refresh-tokens";

        this.primaryKey = "id";

        this.model = {
            id: "",
            userID: "",
            clientID: "",
            refreshToken: "",
            revoked: false,
            createdAt: "",
            updatedAt: ""
        };

    }

}
