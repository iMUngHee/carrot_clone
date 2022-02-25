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
  const product = await client.products.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.products.findMany({
    where: {
      OR: terms,
      NOT: {
        id: product?.id,
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: +id.toString(),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    }),
  );
  res.json({
    ok: true,
    product,
    relatedProducts,
    isLiked,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  }),
);
