import { injectable } from "tsyringe";
import { Session, SessionModel } from "@/auth/session.entity";
import {
  ISessionRepository,
  MultiSessionQuery,
  SessionQuery,
} from "@/auth/auth.types";

@injectable()
export default class SessionRepository implements ISessionRepository {
  constructor() {}

  getOne(query: SessionQuery): Promise<Session | null> {
    return SessionModel.findOne(query).lean().exec();
  }

  get(query: MultiSessionQuery): Promise<Array<Session>> {
    return SessionModel.find(query).lean().exec();
  }

  create(data: Session): Promise<Session> {
    return SessionModel.create(data);
  }

  update(query: SessionQuery, data: Partial<Session>): Promise<Session | null> {
    return SessionModel.findOneAndUpdate(query, data, { new: true })
      .lean()
      .exec();
  }

  async delete(query: SessionQuery): Promise<void> {
    await SessionModel.deleteOne(query).exec();
  }
}
