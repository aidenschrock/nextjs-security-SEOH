import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { createClient } from "@vercel/edge-config";

export async function middleware(NextRequest) {
  if (!process.env.EDGE_CONFIG) {
    return NextResponse.status(200).json({
      message: "Edge Config not configured",
    });
  }

  const edgeStore = createClient(process.env.EDGE_CONFIG);
  const denyIpAddrs = await edgeStore.get("ip_addrs");
  const currIp = NextRequest.ip;

  if (denyIpAddrs.some((e) => e.includes(currIp))) {
    return NextResponse.status(200).json({
      message: "BLOCKED GG",
    });
  }
}

// export async function middleware(NextRequest) {
//   if (!process.env.EDGE_CONFIG) {
//     req.nextUrl.pathname = `/missing-edge-config`;
//     return NextResponse.rewrite(req.nextUrl);
//   }

//   try {
//     // Check whether the maintenance page should be shown
//     const isInMaintenanceMode = (await get) < boolean > "isInMaintenanceMode";

//     // If is in maintenance mode, point the url pathname to the maintenance page
//     if (isInMaintenanceMode) {
//       req.nextUrl.pathname = `/maintenance`;

//       // Rewrite to the url
//       return NextResponse.rewrite(req.nextUrl);
//     }
//   } catch (error) {
//     // show the default page if EDGE_CONFIG env var is missing,
//     // but log the error to the console
//     console.error(error);
//   }
// }
