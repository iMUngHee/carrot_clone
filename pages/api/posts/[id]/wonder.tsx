import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyWonder = await client.wonder.findFirst({
    where: {
      postId: +id.toString(),
      userId: user?.id,
    },
  });
  if (alreadyWonder) {
    await client.wonder.delete({
      where: {
        id: alreadyWonder.id,
      },
    });
  } else {
    await client.wonder.create({
      data: {
        post: {
          connect: {
            id: +id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  }
  return res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  }),
);
