import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.opener.postMessage({ type: "PIPEDRIVE_AUTH_ERROR", error: "${error}" }, "*");
            window.close();
          </script>
          <p>Erreur d'authentification: ${error}</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse("Code manquant", { status: 400 });
  }

  try {
    // Exchange code for tokens via Convex action
    await convex.action(api.pipedrive.exchangeCodeForToken, { code });

    // Send success message to opener window and close popup
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.opener.postMessage({ type: "PIPEDRIVE_AUTH_SUCCESS" }, "*");
            window.close();
          </script>
          <p>Connexion réussie ! Cette fenêtre va se fermer...</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.opener.postMessage({ type: "PIPEDRIVE_AUTH_ERROR", error: "${message}" }, "*");
            window.close();
          </script>
          <p>Erreur: ${message}</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
