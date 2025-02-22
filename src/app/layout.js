import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gray-50">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

