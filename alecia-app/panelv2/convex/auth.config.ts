// Convex Auth Configuration for Clerk
// JWKS URL is public - used for JWT signature verification
// Docs: https://docs.convex.dev/auth/clerk

export default {
  providers: [
    {
      // Use the Clerk custom domain
      domain: "https://clerk.alecia.markets",
      applicationID: "convex",
    },
  ],
};
