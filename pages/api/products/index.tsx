import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const {
    body: { name, price, description },
    session: { user },
  } = req;
  const product = await client.products.create({
    data: {
      name,
      price: +price,
      description,
      image: "img",
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  return res.json({
    ok: true,
    product,
  });
}

export default withApiSession(
  withHandler({
    method: "POST",
    handler,
  }),
);
