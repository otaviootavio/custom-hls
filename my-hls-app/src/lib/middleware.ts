import { NextApiRequest, NextApiResponse } from "next";

async function checkCustomHeader(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers["custom-header"] !== "secretWord") {
    res.status(403).send("Forbidden");
    return false;
  }
  return true;
}

export { checkCustomHeader };
