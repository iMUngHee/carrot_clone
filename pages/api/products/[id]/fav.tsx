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
  const isExists = await client.fav.findFirst({
    where: {
      productId: +id.toString(),
      userId: user?.id,
    },
  });
  if (isExists) {
    await client.fav.delete({
      where: {
        id: isExists.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
        product: {
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
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  }),
);
