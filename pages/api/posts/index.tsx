import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === "POST") {
    const {
      body: { question, longitude, latitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        user: {
          connect: {
            id: user?.id,
          },
        },
        longitude,
        latitude,
      },
    });
    return res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { longitude, latitude },
    } = req;
    const parsedLongitude = parseFloat(longitude.toString());
    const parsedLatitude = parseFloat(latitude.toString());
    const posts = await client.post.findMany({
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
            wonders: true,
            answers: true,
          },
        },
      },
      where: {
        latitude: {
          gte: parsedLatitude - 0.01,
          lte: parsedLatitude + 0.01,
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        },
      },
    });
    return res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  }),
);
