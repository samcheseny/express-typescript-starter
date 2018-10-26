class UsersController {

    public getAll(request: any, response: any): any {
        return response.json({user: "Samuel Ndara"});
    }

    public create(request: any, response: any): void {

    }

}

export default new UsersController();
