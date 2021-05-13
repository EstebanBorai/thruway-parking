import httpResponse from '../../../utils/http-response';
import { InvalidUserRole } from '../../../error/user.service';
import { Role } from '../../../models/user';
import type {
  FastifyError,
  FastifyInstance,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

export default function (
  fastify: FastifyInstance,
  _: FastifyRegisterOptions<unknown>,
  done: (err?: FastifyError) => void,
): void {
  fastify.post(
    '/',
    async (
      request: FastifyRequest<{
        Body: {
          email: string;
          password: string;
          role: Role;
        };
      }>,
      reply: FastifyReply,
    ) => {
      try {
        const user = await fastify.services.user.create(request.body);

        return httpResponse.created(reply, user);
      } catch (error) {
        if (error instanceof InvalidUserRole) {
          return httpResponse.badRequestMessage(reply, error.message);
        }

        return httpResponse.internalServerError(reply, error);
      }
    },
  );

  done();
}
