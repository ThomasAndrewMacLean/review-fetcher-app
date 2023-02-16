// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import NodeCache from "node-cache";
type Data = any;
const cache = new NodeCache({
  stdTTL: 60 * 60 * 24,
  checkperiod: 60 * 60 * 24,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO: get the place_id from the request
  const cached = cache.get("reviews");
  if (cached) {
    return res.status(200).json({ ...cached, cached: true });
  }

  const client = new Client({});
  //   const x = await client.findPlaceFromText({
  //     params: {
  //       input: "Starbucks gent",
  //       inputtype: PlaceInputType.textQuery,
  //       key: process.env.GOOGLE_MAPS_API_KEY!,
  //     },
  //   });
  //   console.log(x.data);
  const y = await client.placeDetails({
    params: {
      place_id: "ChIJ-xZO6d9zw0cRyG7TlL1q0OU",
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  });

  const data = {
    rating: y.data.result.rating,
    numberOfRatings: y.data.result.user_ratings_total,
    reviews: y.data.result.reviews,
  };

  cache.set("reviews", data);

  res.status(200).json({ ...data, cached: false });
}
