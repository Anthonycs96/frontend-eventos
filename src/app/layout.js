import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}