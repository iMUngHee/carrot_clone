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
  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          name: true,
          id: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
          wonders: true,
        },
      },
      answers: {
        select: {
          answer: true,
          user: {
            select: {
              name: true,
              id: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  const isWondering = Boolean(
    await client.wonder.findFirst({
      where: {
        postId: +id.toString(),
        userId: user?.id,
      },
    }),
  );

  return res.json({
    ok: true,
    post,
    isWondering,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  }),
);
