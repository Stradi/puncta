import { apiHandler, parseQuery } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const query = parseQuery(req.query, ["secret", "path"]);

  if (!query.path) {
    return Promise.reject(new ApiError(400, "Insufficent query parameters."));
  }

  if (!query.secret) {
    return Promise.reject(new ApiError(400, "Insufficent query parameters."));
  }

  if (query.secret !== process.env.REVALIDATION_SECRET) {
    return Promise.reject(new ApiError(401, "Invalid request."));
  }

  if (Array.isArray(query.path)) {
    const promises = query.path.map((path) => {
      let absPath = path;
      if (!path.startsWith("/")) {
        absPath = `/${path}`;
      }

      return { promise: res.revalidate(absPath), path: absPath };
    });

    const values = await Promise.allSettled(promises.map((p) => p.promise)); // array of results
    const valuePathMap = promises.map((v, idx) => ({
      path: v.path,
      result: values[idx].status,
    }));

    const validatedPaths = valuePathMap
      .filter((v) => v.result === "fulfilled")
      .map((v) => v.path);
    const notValidatedPaths = valuePathMap
      .filter((v) => v.result === "rejected")
      .map((v) => v.path);

    return res.status(200).json({
      data: {
        validatedPaths,
        notValidatedPaths,
      },
    });
  }

  let absPath = query.path;
  if (!query.path.startsWith("/")) {
    absPath = `/${query.path}`;
  }

  const result = await Promise.allSettled([res.revalidate(absPath)]);
  if (result[0].status === "fulfilled") {
    return res.status(200).json({
      data: {
        validatedPaths: [absPath],
        notValidatedPaths: [],
      },
    });
  } else {
    return res.status(500).json({
      data: {
        validatedPaths: [],
        notValidatedPaths: [absPath],
      },
    });
  }
}

const handler = apiHandler({
  GET: handleGET,
});

export default handler;
