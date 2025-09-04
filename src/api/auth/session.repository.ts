import { inject, injectable } from "tsyringe";
import { Session } from "@/auth/session.entity";
import {
  ISessionRepository,
  MultiSessionQuery,
  SessionQuery,
} from "@/auth/auth.types";
import { Model } from "mongoose";

@injectable()
export default class SessionRepository implements ISessionRepository {
  constructor(
    @inject("SessionModel") private readonly sessionModel: Model<Session>
  ) {}

  getOne(query: SessionQuery): Promise<Session | null> {
    return this.sessionModel.findOne(query).lean().exec();
  }

  get(query: MultiSessionQuery): Promise<Array<Session>> {
    return this.sessionModel.find(query).lean().exec();
  }

  create(data: Session): Promise<Session> {
    return this.sessionModel.create(data);
  }

  update(query: SessionQuery, data: Partial<Session>): Promise<Session | null> {
    return this.sessionModel
      .findOneAndUpdate(query, data, { new: true })
      .lean()
      .exec();
  }

  async delete(query: SessionQuery): Promise<void> {
    await this.sessionModel.deleteOne(query).exec();
  }
}
