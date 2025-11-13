import "../app/globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";

export const metadata = { title: "Email Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Provider store={store}>
          <div className="min-h-screen">
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
