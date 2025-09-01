import { inject, injectable } from "tsyringe";
import { FastifyRequest, FastifyReply } from "fastify";
import { IUserService, UserQuery } from "@/users/user.type";
import { UserSuccess } from "@/users/user.message";

@injectable()
export default class UserController {
  constructor(@inject("IUserService") private userService: IUserService) {}

  async getOne(req: FastifyRequest, res: FastifyReply) {
    const user = await this.userService.getOne(req.query as UserQuery);

    return res.code(200).send({
      message: UserSuccess.SentOne,
      data: { user },
      statusCode: 200,
    });
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    const { isMultiple, userId, userName, email, lastCreatedAt } =
      req.query as any;

    if (!isMultiple) {
      const user = await this.userService.getOne({
        userId: userId || req?.user?._id,
        userName,
        email,
      });

      return res.code(200).send({
        message: UserSuccess.SentOne,
        data: { user },
        statusCode: 200,
      });
    }

    const users = await this.userService.get({ lastCreatedAt, limit: 20 });

    return res.code(200).send({
      message: UserSuccess.SentMany,
      data: { users },
      statusCode: 200,
    });
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const user = await this.userService.create(req.body as any);

    return res.code(200).send({
      message: UserSuccess.Created,
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
      message: UserSuccess.Updated,
      data: { user },
      statusCode: 200,
    });
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const query = req.body as any;

    await this.userService.delete(query);

    return res.code(200).send({
      message: UserSuccess.Deleted,
      statusCode: 200,
    });
  }
}
