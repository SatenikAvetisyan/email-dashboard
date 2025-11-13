import "../app/globals.css";
import ReduxProviderClient from "../components/ReduxProviderClient";

export const metadata = { title: "Email Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ReduxProviderClient>
          <div className="min-h-screen">
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </ReduxProviderClient>
      </body>
    </html>
  );
}
