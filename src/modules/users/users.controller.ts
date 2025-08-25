import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import UserService from "@/users/users.service";
import { MultiUserQuery, UserQuery } from "@/users/users.type";

@injectable()
export default class UserController {
  constructor(@inject("UserService") private userService: UserService) {}

  async getOne(req: FastifyRequest, res: FastifyReply) {
    const user = await this.userService.getOne(req.query as UserQuery);

    return res.code(200).send({
      message: "User sent successfully",
      data: { user },
      statusCode: 200,
    });
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    const user = await this.userService.get(req.query as MultiUserQuery);

    return res.code(200).send({
      message: "Users sent successfully",
      data: { user },
      statusCode: 200,
    });
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const user = await this.userService.create(req.body as any);

    return res.code(200).send({
      message: "Users created successfully",
      data: { user },
      statusCode: 200,
    });
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    const userUpdate = req.body as any;

    const user = await this.userService.update(
      { userId: userUpdate.userId },
      {
        fullName: userUpdate.fullName,
        userName: userUpdate.userName,
        profilePicture: userUpdate.profilePicture,
      }
    );

    return res.code(200).send({
      message: "Users updated successfully",
      data: { user },
      statusCode: 200,
    });
  }
}
